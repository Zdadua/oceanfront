import { createStore, createLogger } from 'vuex'
import mapForTwo from "./modules/mapForTwo.js";
import popup from "./modules/popup.js";
import button from "./modules/button.js";
import overlayChart from "./modules/overlayChart.ts";

export default createStore({
    modules: {
        mapForTwo,
        popup,
        button,
        overlayChart
    },
})
