import { createRouter, createWebHashHistory } from 'vue-router'
import AboutUs from "../../components/aboutUs/AboutUs.vue";
import TwoDimensionMap from "../../components/2D/TwoDimensionMap.vue";


const routes = [
    {
        path: '/',
        component: AboutUs,
    },
    {
        path: '/twoMap',
        component: TwoDimensionMap
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export {
    router
}