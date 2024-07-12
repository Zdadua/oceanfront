

const state = () => ({
    popup: false,
});

const mutations = {
    popup(state) {
        state.popup = true;
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

