import {Feature, Overlay} from "ol";
import {Point} from "ol/geom.js";
import {Icon, Style} from "ol/style.js";
import store from "../../store/index.js";
import {toStringHDMS} from "ol/coordinate.js";
import {toLonLat} from "ol/proj.js";
import OverlayInfo from "../../components/2D/OverlayInfo.vue";
import {createVNode} from "vue";


class DotOverlay {
    id = null;
    overlay = null;
    dotFeature = null;
    dotStyle = new Style({
        image: new Icon({
            src: './src/assets/svg/circleIcon.svg'
        })
    });
    hiddenOverlay = null;
    hiddenElement = document.createElement('div');
    outsideDom = null;
    coordinate = null;

    constructor(id, dom, coordinate) {
        if(dom instanceof HTMLElement) {
            this.outsideDom = dom;
            this.coordinate = coordinate;

            this.init();
        }

        if(id != null) {
            this.id = id;
        }

        const vnode = createVNode(OverlayInfo, {props: {

            }});

    }

    init() {
        this.initOverlay();
        this.initFeature();
    }

    initOverlay() {
        this.initElement();

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

        this.hiddenOverlay = new Overlay({
            element: this.hiddenElement,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
            stopEvent: true,
        });
        this.hiddenOverlay.setPosition(this.coordinate);
    }

    initElement() {
        this.initHiddenElement();

        this.outsideDom.childNodes[1].innerHTML = toStringHDMS(toLonLat(this.coordinate));

        this.outsideDom.childNodes[2].addEventListener('click', (event) => {
            store.commit('mapForTwo/hide', this.id);
        })

        this.outsideDom.childNodes[3].addEventListener('click', (event) => {
            store.commit('mapForTwo/remove', this.id);
        })

        this.hiddenElement.addEventListener('click', (event) => {
            store.state['mapForTwo'].map.addOverlay(this.overlay);
            store.state['mapForTwo'].map.removeOverlay(this.hiddenOverlay);
        });

    }

    initHiddenElement() {
        this.hiddenElement.style.left = '-5px';
        this.hiddenElement.style.top = '-5px';
        this.hiddenElement.style.position = 'absolute';
        this.hiddenElement.style.width = '10px';
        this.hiddenElement.style.height = '10px';
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

    getHiddenOverlay() {
        return this.hiddenOverlay;
    }

    setId(id) {
        if(id) {
            this.id = id;
        }
    }
}

export {
    DotOverlay
}