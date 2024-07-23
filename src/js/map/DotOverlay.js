import {Feature, Overlay} from "ol";
import {LineString, Point} from "ol/geom.js";
import {Icon, Stroke, Style} from "ol/style.js";
import OverlayInfo from "../../components/2D/OverlayInfo.vue";
import {createApp, nextTick} from "vue";
import store from "../../store/index.js";

class DotOverlay {
    id = null;
    overlay = null;
    dotFeature = null;
    dotStyle = new Style({
        image: new Icon({
            src: './src/assets/svg/newCircle.svg'
        })
    });

    lineFeature = null;
    lineStyle = new Style({
        stroke: new Stroke({
            color: 'black',
            width: 2
        })
    })
    outsideDom = null;
    coordinate = null;
    overlayPosition = null;

    constructor(id, coordinate) {
        this.coordinate = coordinate;

        let tmp = store.state['mapForTwo'].map.getPixelFromCoordinate(coordinate);
        tmp[0] = tmp[0] + 20;

        this.overlayPosition = store.state['mapForTwo'].map.getCoordinateFromPixel(tmp);

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
        this.initLine();
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
        this.overlay.setPosition(this.overlayPosition);
    }

    initFeature() {
        this.dotFeature = new Feature({
            geometry: new Point(this.coordinate)
        })
        this.dotFeature.setStyle(this.dotStyle);
    }

    initLine() {
        let first = this.coordinate;
        let second = this.overlayPosition;

        const line = new LineString([first, second]);
        this.lineFeature = new Feature({
            geometry: line,
        })

        this.lineFeature.setStyle(this.lineStyle);
    }

    updateLine(newCoordinate) {
        let line = this.lineFeature.getGeometry();

        let first = this.coordinate;

        line.setCoordinates([first, newCoordinate]);
        this.lineFeature.changed();
    }

    getOverlay() {
        return this.overlay;
    }

    getDotFeature() {
        return this.dotFeature;
    }

    getLineFeature() {
        return this.lineFeature;
    }

    getCoordinate() {
        return this.coordinate;
    }

    getPosition() {
        return this.overlayPosition;
    }

    setPosition(position) {
        this.overlayPosition = position;
    }

    getStyle() {
        return this.dotStyle;
    }
}

export {
    DotOverlay
}