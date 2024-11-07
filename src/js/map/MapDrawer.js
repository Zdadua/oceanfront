import {Feature, Graticule, Map, Overlay, View} from "ol";
import {fromLonLat, toLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import {toStringHDMS} from "ol/coordinate";
import {Vector, XYZ} from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import store from "../../store/index.js";
import "../../styles/map/twoDimensionMap.css";
import {Point} from "ol/geom";
import {Icon, Stroke, Style} from "ol/style";
import {DotOverlay} from "./DotOverlay.js";
import {ScaleLine} from "ol/control.js";
import {easeOut} from "ol/easing.js";



class MapDrawer {

    element = null;
    map = null;
    vectorSource = new Vector();
    vectorLayer = new VectorLayer({
        source: this.vectorSource
    });

    seaSource = new Vector();
    seaLayer = new VectorLayer({
        source: this.seaSource
    });

    constructor(element) {
        if(element instanceof HTMLElement) {
            this.element = element;
        }
    }

    init() {
        this.initMap();
        this.initSouthSea();
    }

    initSouthSea() {
        const pinStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
              src: '/static/svg/pin.svg'
            })
        });

        const pinFeature = new Feature({
            geometry: new Point(fromLonLat([115.5, 18.5]))
        });

        pinFeature.setStyle(pinStyle);
        this.seaSource.addFeature(pinFeature);
    }

    initMap() {
        this.vectorLayer.set('name', 'dotLayer');

        let tmp = new Date();
        tmp.setDate(tmp.getDate() - 1);

        let year = tmp.getFullYear();
        let month = tmp.getMonth() + 1;
        let day = tmp.getDate();

        month = month < 10 ? `0${month}` : `${month}`;
        day = day < 10 ? `0${day}` : `${day}`;


        let options = {
            target: this.element.id,
            layers: [
                // new TileLayer({
                //     source: new OSM(),
                // }),
                new TileLayer({
                    preload: 2,
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: `http://localhost:5000/tiles/sst_tiles/${year}-${month}-${day}/{z}/{x}_{y}.png`,
                        // url: '../../../public/static/sst_tiles/{z}/{x}_{y}.png',

                    })
                }),

                new TileLayer({
                    preload: Infinity,
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: 'http://localhost:5000/tiles/world_tiles/{z}/{x}_{y}.png',
                    })
                }),
                this.vectorLayer,

                new Graticule({
                    strokeStyle: new Stroke({
                        color: 'rgba(12,12,12,0.19)',
                        width: 0.6,
                    }),
                    targetSize: 100,
                }),
                this.seaLayer,
            ],
            overlays: [],
            view: new View({
                center: fromLonLat([160, 25]),
                minZoom: 2,
                maxZoom: 8,
                zoom: 2,
                constrainResolution: true,
            }),
            controls: [],
        };
        this.map = new Map(options);

        store.state['mapForTwo'].map = this.map;

        this.map.on('click', (event) => {

            let isFeature = false;
            this.map.forEachFeatureAtPixel(event.pixel, function(feature) {
                if(feature) {
                    isFeature = true;
                }
            })

            if(!isFeature) {
                if(store.state['mapForTwo'].onUI) {
                    store.commit('mapForTwo/setOnUI', 0);
                }
                else {
                    let coordinate = event.coordinate;
                    let [lon, lat] = toLonLat(coordinate);
                    store.commit('mapForTwo/updateInfo', [lon, lat]);

                    if(store.state['mapForTwo'].showMode) {
                        store.state['mapForTwo'].dotIdx++;
                    }
                    let dotOverlay = new DotOverlay(store.state['mapForTwo'].dotIdx, coordinate);

                    dotOverlay.initDotOverlay().then(() => {
                        store.commit('popup/updateShowDot', store.state['mapForTwo'].dotIdx);
                        store.commit('mapForTwo/pushPoint', dotOverlay);
                    })
                }
            }
            else {
                const view = this.map.getView();
                view.animate({
                    center: fromLonLat([115.5, 18.5]),
                    zoom: 6,
                    rotation: 0,
                    duration: 600,
                    easing: easeOut
                });
                this.seaLayer.setVisible(false);
                store.commit('mapForTwo/focusOnSea');
                store.commit('overlayChart/setType', 1);
            }
        })
    }

}

export {
    MapDrawer,
}
