

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
    points: [],
    dots: [],
    dotIdx: 0,
    map: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
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
    },

    showMode(state) {
        state.showMode = state.showMode ? 0 : 1;

        if(state.showMode) {
            state.clickMode = 2;
        }
        else {
            state.clickMode -= 2;

            for(let i = 0; i < state.points.length - 1; i++) {
                state.map.removeOverlay(state.points[i]);
            }
        }
    },


    pushPoint(state, overlay) {
        if(!state.showMode) {
            state.points[0] = overlay;
            state.map.getOverlays().forEach((item) => {
                state.map.removeOverlay(item);
            })
        }
        else {
            state.points.push(overlay);
        }
        state.map.addOverlay(overlay);
    },

    pushDot(state, dotFeature) {
        let layers =  state.map.getLayers();
        let source = null;


        for(let i = 0; i < layers.length; i++) {
            if(layers[i].get('name') === 'dotLayer') {
                source = layers[i].getSource();
                break;
            }
        }

        if(!state.showMode) {
            state.dots[0] = dotFeature;
            state.dotIdx = 1;
            // source.addFeature(dotFeature);
        }
        else {
            state.dots[state.dotIdx++] = dotFeature;
            // source.addFeature(dotFeature);
        }
    },

    year(state, y) {
        state.year = y;
    },

    month(state, m) {
        state.month = m;
    }

}

export default {
    namespaced: true,
    state,
    mutations,
}