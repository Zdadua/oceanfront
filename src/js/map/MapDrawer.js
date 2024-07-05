import {Feature, Map, Overlay, View} from "ol";
import {fromLonLat, toLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import {toStringHDMS} from "ol/coordinate";
import {Vector, XYZ} from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import store from "../../store/index.js";
import "../../styles/map/twoDimensionMap.css";
import {Point} from "ol/geom";
import {Icon, Style} from "ol/style";



class MapDrawer {

    element = null;
    infoElement = null;
    hiddenElement = null;
    map = null;
    vectorSource = new Vector();
    vectorLayer = new VectorLayer({
        source: this.vectorSource
    });
    iconStyle = new Style({
        image: new Icon({
            src: './src/assets/svg/circleIcon.svg'
        })
    })

    constructor(element, dom) {
        // this.infoElement = document.createElement('div');
        // this.infoElement.classList.add('info-container');
        // this.infoElement.innerHTML = '      <div class="info-text">Current Position:</div>\n' +
        //     '      <div class="lon-lat"></div>';
        this.infoElement = dom;

        if(element instanceof HTMLElement) {
            this.element = element;
        }

        this.hiddenElement = document.createElement('div');
        this.hiddenElement.style.left = '-5px';
        this.hiddenElement.style.top = '-5px';
        this.hiddenElement.style.position = 'absolute';
        this.hiddenElement.style.width = '10px';
        this.hiddenElement.style.height = '10px';
    }

    init() {
        this.initMap();
    }

    initMap() {
        this.vectorLayer.set('name', 'dotLayer');

        let options = {
            target: this.element.id,
            layers: [
                // new TileLayer({
                //     source: new OSM(),
                // }),
                new TileLayer({
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: 'http://172.20.163.79:5000/tiles/sst_tiles/2024-01-01.csv.png/{z}/{x}_{y}.png',
                        // url: '../../../public/static/sst_tiles/{z}/{x}_{y}.png',

                    })
                }),
                new TileLayer({
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: 'http://172.20.163.79:5000/tiles/world_tiles/{z}/{x}_{y}.png',
                        // url: '../../../public/static/world_tiles/{z}/{x}_{y}.png',

                    })
                }),
                this.vectorLayer
            ],
            overlays: [],
            view: new View({
                center: fromLonLat([160, 25]),
                minZoom: 2,
                maxZoom: 5,
                zoom: 2,

            }),
            controls: [],
        };
        this.map = new Map(options);

        store.state['mapForTwo'].map = this.map;

        this.map.on('click', (event) => {
            if(store.state['mapForTwo'].onUI) {
                store.commit('mapForTwo/setOnUI', 0);
            }
            else {
                let coordinate = event.coordinate;
                let [lon, lat] = toLonLat(coordinate);
                store.commit('mapForTwo/updateInfo', [lon, lat]);


                let cloneDom = this.infoElement.cloneNode(true);
                cloneDom.children[1].innerHTML = toStringHDMS([lon, lat]);

                if(!store.state['mapForTwo'].clickMode) {
                    cloneDom.setAttribute('dotIdx', 0);
                }
                else {
                    cloneDom.setAttribute('dotIdx', store.state['mapForTwo'].dotIdx);
                }

                cloneDom.childNodes[2].addEventListener('click', (event) => {
                    store.commit('mapForTwo/hide', cloneDom.getAttribute('dotIdx'));
                })

                cloneDom.childNodes[3].addEventListener('click', (event) => {
                    store.commit('mapForTwo/remove', cloneDom.getAttribute('dotIdx'));
                })

                let overlay = new Overlay({
                    element: cloneDom,
                    autoPan: {
                        animation: {
                            duration: 250,
                        },
                    },
                    stopEvent: true,
                });
                overlay.setPosition(coordinate);

                let cloneHidden = this.hiddenElement.cloneNode(true);
                cloneHidden.addEventListener('click', (event) => {
                   store.state['mapForTwo'].map.addOverlay(overlay);
                   store.state['mapForTwo'].map.removeOverlay(hiddenOverlay);
                });

                let hiddenOverlay = new Overlay({
                    element: cloneHidden,
                    autoPan: {
                        animation: {
                            duration: 250,
                        },
                    },
                    stopEvent: true,
                })
                hiddenOverlay.setPosition(coordinate);

                let dotFeature = new Feature({
                    geometry: new Point(event.coordinate)
                })
                dotFeature.setStyle(this.iconStyle);

                store.commit('mapForTwo/pushPoint', [overlay, dotFeature, hiddenOverlay]);
            }

        })
    }

}

export {
    MapDrawer,
}