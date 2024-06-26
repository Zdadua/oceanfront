

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
    calendarTime: new Date(),
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
        }
    },

    changeTime(state, year, month, day) {
        state.calendarTime = new Date(year, month, day);
    }

}

export default {
    namespaced: true,
    state,
    mutations,
}