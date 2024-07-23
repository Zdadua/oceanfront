import store from "../index.js";


const state = () => ({
    popup: false,
    showDot: null,
});

const mutations = {
    popup(state, idx) {
        state.popup = true;
        state.showDot = idx;
    },

    dismiss(state) {
        state.popup = false;
    },

    updateShowDot(state, idx) {
        state.showDot = idx;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
}

