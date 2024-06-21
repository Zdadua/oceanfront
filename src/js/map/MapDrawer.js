import { getCoastLine } from "../fetchData.js";
import {Feature, ImageTile, Map, Overlay, Tile, VectorTile, View} from "ol";
import {fromLonLat, toLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {toStringHDMS} from "ol/coordinate.js";
import {XYZ} from "ol/source.js";
import {GeoJSON} from "ol/format.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";

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
        });

        overlay.setPosition(undefined);

        let vectorSource = new VectorSource({
            format: new GeoJSON(),
            url: './src/assets/geoJson/world.json',
        });

        let vectorLayer = new VectorLayer({
            source: vectorSource
        });

        let options = {
            target: this.element.id,
            layers: [
                // new TileLayer({
                //     source: new OSM(),
                // }),
                new TileLayer({
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: './public/static/sst_tiles/{z}/{x}_{y}.png',

                    })
                }),
                new TileLayer({
                    source: new XYZ({
                        // 配置瓦片图层的URL模板和参数
                        url: './public/static/world_tiles/{z}/{x}_{y}.png',

                    })
                }),
            ],
            overlays: [overlay],
            view: new View({
                center: fromLonLat([0, 0]),
                minZoom: 2,
                maxZoom: 5,
                zoom: 2,

            }),
        };
        this.map = new Map(options);

        this.map.on('click', (event) => {
            let coordinate = event.coordinate;
            this.infoElement.childNodes[1].innerHTML = toStringHDMS(toLonLat(coordinate));
            overlay.setPosition(coordinate)

        })
    }



    showDetail() {

    }
}

export {
    MapDrawer,
}