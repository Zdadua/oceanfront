import store from "../index.js";


const state = () => ({
    popup: false,
    showDot: null,
});

const mutations = {
    popup(state, idx) {
        state.popup = true;
        state.showDot = store.state['mapForTwo'].points.get(idx);
    },

    dismiss(state) {
        state.popup = false;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
}

