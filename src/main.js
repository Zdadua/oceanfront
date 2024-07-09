import {createApp, ref} from 'vue'
import App from './App.vue'
import './styles/global.css'
import {router} from "./router/router.js";
import store from "./store";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
