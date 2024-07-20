import store from "../index.js";


const state = () => ({
    lockMode: 0,
    windFieldMode: 0,
    oceanCurrentMode: 0,
    topOverlayId: -1,
});

const mutations = {
    setTopOverlay(state, id) {

    }
};

export default {
    namespaced: true,
    state,
    mutations,
}