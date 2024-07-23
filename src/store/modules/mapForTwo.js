import {DragPan} from "ol/interaction.js";
import {XYZ} from "ol/source";
import { Map as olMap, Overlay } from "ol";
import { lonLatToDMS } from "../../js/tools.js"
import { DotIterator } from "../../js/map/DotIterator.js"


const state = () => ({
    onUI: 0,
    lon: "0°00\'00\"   E",
    lat: "0°00\'00\"   N",

    /*
    * 四个状态
    * 0: 按钮可控，左侧
    * 1: 按钮可控，右侧
    * 2: 按钮不可控，左侧
    * 3: 按钮不可控，右侧
    * */
    showMode: 0,
    draggable: 0,

    // dotOverlay对象数组
    points: new Map(),
    lastPoint: 0,
    dotIdx: 0,

    map: null,

    year: 0,
    tmpYear: 0,
    month: 0,
    tmpMonth: 0,
    day: 1,
    maxPredictNum: 7,
})

const mutations = {

    updateInfo(state, [lon, lat]) {
        let ll = lonLatToDMS(lon, lat);

        state.lon = `${ll.lonD}°${ll.lonM}'${ll.lonS}"   ${ll.lonPassive < 0 ? 'W' : 'E'}`;
        state.lat = `${ll.latD}°${ll.latM}'${ll.latS}"   ${ll.latPassive < 0 ? 'S' : 'N'}`;
    },

    setOnUI(state, val) {
        state.onUI = val;
    },

    showMode(state) {
        state.showMode = state.showMode ? 0 : 1;
        let source = state.map.getLayers().getArray().at(2).getSource();

        let dotOverlay = state.points.get(state.lastPoint);
        for(let i = state.lastPoint - 1; i >= 0; i--) {
            if(state.points.has(i)) {
                state.map.removeOverlay(state.points.get(i).getOverlay());
                state.points.delete(i);
            }
        }

        source.clear(true);
        source.addFeature(dotOverlay.getDotFeature());
        source.addFeature(dotOverlay.getLineFeature());
    },

    draggable(state) {
        let interactions = state.map.getInteractions().getArray();
        let drag = interactions.find((i) => i instanceof DragPan);

        if(drag) {
            state.draggable = !state.draggable
            drag.setActive(!state.draggable);
        }
    },


    pushPoint(state, dotOverlay) {

        let source = state.map.getLayers().getArray().at(2).getSource();

        if(!state.showMode) {
            for(let value of state.points.values()) {
                state.map.removeOverlay(value.getOverlay());
            }

            state.points.set(state.dotIdx, dotOverlay);
            source.clear(true);
            state.lastPoint = state.dotIdx;
        }
        else {
            state.points.set(state.dotIdx, dotOverlay);
            state.lastPoint = state.dotIdx;
        }

        DotIterator.updateMap(state.points);

        state.map.addOverlay(dotOverlay.getOverlay());
        source.addFeature(dotOverlay.getDotFeature());
        source.addFeature(dotOverlay.getLineFeature());

        // console.log(dotOverlay.)
    },

    year(state, y) {
        state.year = y;
    },

    tmpYear(state, y) {
        state.tmpYear = y;
    },

    month(state, m) {
        state.month = m;
    },

    tmpMonth(state, m) {
        state.tmpMonth = m;
    },

    day(state, d) {
        state.day = d;

        if(state.map instanceof olMap) {
            let layer = state.map.getLayers().getArray().at(0);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}/{z}/{x}_{y}.png`
            }))
        }

        state.year = state.tmpYear;
        state.month = state.tmpMonth;
    },

    remove(state, idx) {
        state.map.removeOverlay(state.points.get(idx).getOverlay());
        let source = state.map.getLayers().getArray().at(2).getSource();
        source.removeFeature(state.points.get(idx).getDotFeature());
        source.removeFeature(state.points.get(idx).getLineFeature());
        state.points.delete(idx);

        for(let i = state.dotIdx - 1; i >= 0; i--) {
            if(state.points.has(i)) {
                state.lastPoint = i;
            }
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
}