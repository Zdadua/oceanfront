import { createStore, createLogger } from 'vuex'
import mapForTwo from "./modules/mapForTwo.js";

export default createStore({
    modules: {
        mapForTwo
    },
})