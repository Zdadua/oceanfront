import { getCoastLine } from "../fetchData.js";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import {GeoJSON} from "ol/format.js";


/**
 * 绘制地图轮廓线
 */

class LineDrawer {

    element = null;
    map = null;

    constructor(element) {
        if(element instanceof HTMLElement) {
            this.element = element;
        }
    }

    /**
     * 初始化svg，绘制轮廓线
     * @returns {Promise<void>}
     */
    async init() {
        // getCoastLine().then(json => {
        //     if(json != null && this.element != null) {
        //         return null;
        //     }
        //
        // })
        await this.initMap();
    }

    initMap() {
        let options = {
            target: this.element.id,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([0, 0]),
                zoom: 2,
            }),
        };

        this.map = new Map(options);

        let vectorSource = new VectorSource({
            format: new GeoJSON(),
            url: './src/assets/geoJson/world.json',
        });

        let vectorLayer = new VectorLayer({
            source: vectorSource,
        });
        this.map.addLayer(vectorLayer);
    }
}

export {
    LineDrawer,
}