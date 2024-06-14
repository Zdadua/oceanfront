import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import {router} from "./assets/js/router.js";

const app = createApp(App);
app.use(router);
app.mount('#app');
