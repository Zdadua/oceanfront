import { createRouter, createWebHistory } from 'vue-router'
import AboutUs from "../../components/aboutUs/AboutUs.vue";
import TwoDimensionMap from "../../components/2D/TwoDimensionMap.vue";


const routes = [
    {
        path: '/about',
        component: AboutUs,
    },
    {
        path: '/twoMap',
        component: TwoDimensionMap
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export {
    router
}