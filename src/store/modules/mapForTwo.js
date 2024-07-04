import {DragPan} from "ol/interaction.js";
import {XYZ} from "ol/source";
import {Map} from "ol";


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
    points: [],
    dots: [],
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
                state.map.removeOverlay(state.points[0]);
                source.clear(true);
            }
            else {
                state.map.addOverlay(state.points[0]);
                source.addFeature(state.dots[0]);
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


            for(let i = state.dotIdx - 1; i >= 0; i--) {
                state.map.removeOverlay(state.points[i]);
            }

            state.dots[0] = state.dots[state.dotIdx - 1];
            state.points[0] = state.points[state.dotIdx - 1];
            state.dotIdx = 1;

            console.log(state.map.getOverlays());

            source.clear(true);
            source.addFeature(state.dots[0]);
            state.map.addOverlay(state.points[0]);
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


    pushPoint(state, [overlay, dotFeature]) {
        let source = state.map.getLayers().getArray().at(2).getSource();

        if(!state.showMode) {
            state.dotIdx = 1;

            for(let i = state.dotIdx - 1; i >= 0; i--) {
                state.map.removeOverlay(state.points[i]);
            }

            state.points[0] = overlay;
            state.dots[0] = dotFeature;
            source.clear(true);
        }
        else {
            state.points[state.dotIdx] = overlay;
            state.dots[state.dotIdx++] = dotFeature;
        }

        if(!(state.clickMode % 2)){
            state.map.addOverlay(overlay);
            source.addFeature(dotFeature);
        }

    },

    year(state, y) {
        state.year = y;

        if(state.map instanceof Map) {
            let layer = state.map.getLayers().getArray().at(0);
            console.log(layer);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}.csv.png/{z}/{x}_{y}.png`
            }))
        }

    },

    month(state, m) {
        state.month = m;

        if(state.map instanceof Map) {
            let layer = state.map.getLayers().getArray().at(0);
            console.log(layer);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}.csv.png/{z}/{x}_{y}.png`
            }))
        }

    },

    day(state, d) {
        state.day = d;

        if(state.map instanceof Map) {
            let layer = state.map.getLayers().getArray().at(0);
            console.log(layer);
            let month = state.month < 10 ? `0${state.month}` : `${state.month}`;
            let day = state.day < 10 ? `0${state.day}` : `${state.day}`;
            layer.setSource(new XYZ({
                url: `http://172.20.163.79:5000/tiles/sst_tiles/${state.year}-${month}-${day}.csv.png/{z}/{x}_{y}.png`
            }))
        }
    },

    hide(state, idx) {
        console.log(idx);
    },

    show(state, idx) {

    }
}

export default {
    namespaced: true,
    state,
    mutations,
}