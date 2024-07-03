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

    constructor(element) {
        this.infoElement = document.createElement('div');
        this.infoElement.classList.add('info-container');
        this.infoElement.innerHTML = '      <div class="info-text">Current Position:</div>\n' +
            '      <div v-if="true" class="lon-lat"></div>';

        if(element instanceof HTMLElement) {
            this.element = element;
        }
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
                        url: 'http://172.20.163.79:5000/tiles/sst_tiles/2024-01-01/{z}/{x}_{y}.png',
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
                center: fromLonLat([0, 0]),
                minZoom: 1,
                maxZoom: 5,
                zoom: 1,

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
                // lon = lon + (lon < 0 ? 180 : -180);
                store.commit('mapForTwo/updateInfo', [lon, lat]);

                let cloneDom = this.infoElement.cloneNode(true);
                cloneDom.children[1].innerHTML = toStringHDMS([lon, lat]);
                let overlay = new Overlay({
                    element: cloneDom,
                    autoPan: {
                        animation: {
                            duration: 250,
                        },
                    },
                    stopEvent: false,
                })
                overlay.setPosition(coordinate);

                let dotFeature = new Feature({
                    geometry: new Point(event.coordinate)
                })
                dotFeature.setStyle(this.iconStyle);

                console.log(this.map.getLayers());

                store.commit('mapForTwo/pushPoint', overlay);
                store.commit('mapForTwo/pushDot', dotFeature);
            }

        })
    }

}

export {
    MapDrawer,
}