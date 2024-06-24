import {createApp, ref} from 'vue'
import App from './App.vue'
import './styles/global.css'
import {router} from "./js/router.js";
import {createStore} from "vuex";

const store = createStore({
    state() {
        return {
            onUI: ref(0),
        }
    },

    mutations: {
        setOnUI(state, val) {
            state.onUI = val;
        }
    }
})

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');

export {
    store,
}
