
const state = () => {
    return {
        type: 0 // 0: 普通折线图; 1: 以小时为单位的折线图; 2: 三维(指添加深度)折线图
    }
}

const mutations = {
    setType(state: any, type: number) {
        state.type = type;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
}
