import {Map, Overlay, View} from "ol";
import {fromLonLat, toLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import {toStringHDMS} from "ol/coordinate";
import {XYZ} from "ol/source";
import store from "../../store/index.js";

class MapDrawer {

    element = null;
    infoElement = null;
    map = null;

    constructor(element, infoElement) {
        if(element instanceof HTMLElement) {
            this.element = element;
            this.infoElement = infoElement;
        }
    }

    init() {
        this.initMap();
    }

    initMap() {

        const overlay = new Overlay({
            element: this.infoElement,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
            stopEvent: false,
        });

        overlay.setPosition(undefined);

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

                    })
                }),
                new TileLayer({
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: 'http://172.20.163.79:5000/tiles/world_tiles/{z}/{x}_{y}.png',

                    })
                }),
            ],
            overlays: [overlay],
            view: new View({
                center: fromLonLat([0, 0]),
                minZoom: 1,
                maxZoom: 5,
                zoom: 1,
            }),
            controls: [],
        };
        this.map = new Map(options);

        this.map.on('click', (event) => {
            if(store.state['mapForTwo'].onUI) {
                store.commit('mapForTwo/setOnUI', 0);
            }

            let coordinate = event.coordinate;
            let [lon, lat] = toLonLat(coordinate);
            lon = lon + (lon < 0 ? 180 : -180);
            store.commit('mapForTwo/updateInfo', [lon, lat]);

            if(!store.state['mapForTwo'].clickMode) {
                this.infoElement.childNodes[1].innerHTML = toStringHDMS([lon, lat]);
                overlay.setPosition(coordinate);
            }

        })
    }

}

export {
    MapDrawer,
}