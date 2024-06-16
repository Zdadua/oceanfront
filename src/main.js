import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import {router} from "./js/router.js";

const app = createApp(App);
app.use(router);
app.mount('#app');
