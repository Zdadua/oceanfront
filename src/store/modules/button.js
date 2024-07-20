import store from "../index.js";


const state = () => ({
    lockMode: 0,
    windFieldMode: 0,
    oceanCurrentMode: 0,
    topOverlayId: -1,
    popup: false,
});

const mutations = {
    setTopOverlay(state, id) {

    },

    popup(state) {
        state.popup = !state.popup;
    },

};

export default {
    namespaced: true,
    state,
    mutations,
}