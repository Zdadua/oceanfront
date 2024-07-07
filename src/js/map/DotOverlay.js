import {Feature, Overlay} from "ol";
import {Point} from "ol/geom.js";
import {Icon, Style} from "ol/style.js";
import OverlayInfo from "../../components/2D/OverlayInfo.vue";
import {createApp, nextTick} from "vue";
import store from "../../store/index.js";

class DotOverlay {
    id = null;
    overlay = null;
    dotFeature = null;
    dotStyle = new Style({
        image: new Icon({
            src: './src/assets/svg/circleIcon.svg'
        })
    });
    outsideDom = null;
    coordinate = null;

    constructor(id, coordinate) {
        this.coordinate = coordinate;

        if(id != null) {
            this.id = id;
        }
    }

    async initDotOverlay() {
        let tmpContainer = document.createElement('div');
        const app = createApp(OverlayInfo, {
            coordinate: this.coordinate,
            id: this.id,
        });
        app.use(store);
        app.mount(tmpContainer);

        await nextTick();

        this.outsideDom = tmpContainer.children[0];
        this.init();
    }

    init() {
        this.initOverlay();
        this.initFeature();
    }

    initOverlay() {
        this.overlay = new Overlay({
            element: this.outsideDom,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
            stopEvent: true,
        });
        this.overlay.setPosition(this.coordinate);
    }

    initFeature() {
        this.dotFeature = new Feature({
            geometry: new Point(this.coordinate)
        })
        this.dotFeature.setStyle(this.dotStyle);
    }

    getOverlay() {
        return this.overlay;
    }

    getDotFeature() {
        return this.dotFeature;
    }
}

export {
    DotOverlay
}