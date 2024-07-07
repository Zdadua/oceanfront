import {DragPan} from "ol/interaction.js";
import {XYZ} from "ol/source";
import { Map as olMap, Overlay } from "ol";


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
    clickMode: 0,
    showMode: 0,
    draggable: 0,
    popup: false,

    // dotOverlay对象数组
    points: new Map(),
    lastPoint: 0,
    dotIdx: 0,

    map: null,

    year: 0,
    month: 0,
    day: 1,
})

const mutations = {

    updateInfo(state, [lon, lat]) {
        let absLon = Math.abs(lon); // 取绝对值以便计算
        let lonD = Math.floor(absLon); // 度
        let lonM = Math.floor((absLon - lonD) * 60); // 分
        lonM = lonM < 10 ? '0' + lonM : lonM;
        let lonS = Math.floor((absLon - lonD - lonM / 60) * 3600); // 秒
        lonS = lonS < 10 ? '0' + lonS : lonS;

        let absLat = Math.abs(lat); // 取绝对值以便计算
        let latD = Math.floor(absLat); // 度
        let latM = Math.floor((absLat - latD) * 60); // 分
        latM = latM < 10 ? '0' + latM : latM;
        let latS = Math.floor((absLat - latD - latM / 60) * 3600); // 秒
        latS = latS < 10 ? '0' + latS : latS;

        state.lon = `${lonD}°${lonM}'${lonS}"   ${lon < 0 ? 'W' : 'E'}`;
        state.lat = `${latD}°${latM}'${latS}"   ${lat < 0 ? 'S' : 'N'}`;
    },

    setOnUI(state, val) {
        state.onUI = val;
    },

    clickMode(state) {
        state.clickMode = state.clickMode ? 0 : 1;
        let source = state.map.getLayers().getArray().at(2).getSource();

        if(state.dotIdx) {
            if(state.clickMode) {
                state.map.removeOverlay(state.points.get(state.lastPoint).getOverlay());
                source.clear(true);
            }
            else {
                state.map.addOverlay(state.points.get(state.lastPoint).getOverlay());
                source.addFeature(state.points.get(state.lastPoint).getDotFeature());
            }
        }
    },

    showMode(state) {
        state.showMode = state.showMode ? 0 : 1;
        let source = state.map.getLayers().getArray().at(2).getSource();

        if(state.showMode) {
            state.clickMode = 2;
        }
        else {
            state.clickMode -= 2;

            let dotOverlay = state.points.get(state.lastPoint);
            for(let i = state.lastPoint - 1; i >= 0; i--) {
                if(state.points.has(i)) {
                    state.map.removeOverlay(state.points.get(i).getOverlay());
                    state.points.delete(i);
                }
            }

            source.clear(true);
            source.addFeature(dotOverlay.getDotFeature());
        }
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



        if(!(state.clickMode % 2)){
            state.map.addOverlay(dotOverlay.getOverlay());
            source.addFeature(dotOverlay.getDotFeature());
        }

    },

    year(state, y) {
        state.year = y;

        if(state.map instanceof olMap) {
            let layer = state.map.getLayers().getArray().at(0);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}.csv.png/{z}/{x}_{y}.png`
            }))
        }

    },

    month(state, m) {
        state.month = m;

        if(state.map instanceof olMap) {
            let layer = state.map.getLayers().getArray().at(0);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}.csv.png/{z}/{x}_{y}.png`
            }))
        }

    },

    day(state, d) {
        state.day = d;

        if(state.map instanceof olMap) {
            let layer = state.map.getLayers().getArray().at(0);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}.csv.png/{z}/{x}_{y}.png`
            }))
        }
    },

    remove(state, idx) {
        state.map.removeOverlay(state.points.get(idx).getOverlay());
        let source = state.map.getLayers().getArray().at(2).getSource();
        source.removeFeature(state.points.get(idx).getDotFeature());
        state.points.delete(idx);

        for(let i = state.dotIdx - 1; i >= 0; i--) {
            if(state.points.has(i)) {
                state.lastPoint = i;
            }
        }
    },

    popup(state) {
        state.popup = true;
    },

    dismiss(state) {
        state.popup = false;
    }

}

export default {
    namespaced: true,
    state,
    mutations,
}