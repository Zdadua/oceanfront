import { createStore, createLogger } from 'vuex'
import mapForTwo from "./modules/mapForTwo.js";
import popup from "./modules/popup.js";

export default createStore({
    modules: {
        mapForTwo,
        popup
    },
})