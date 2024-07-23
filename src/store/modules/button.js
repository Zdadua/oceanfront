import store from "../index.js";


const state = () => ({
    popup: false,
});

const mutations = {

    popup(state) {
        state.popup = !state.popup;
    },

};

export default {
    namespaced: true,
    state,
    mutations,
}