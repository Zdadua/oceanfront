import store from "../../store/index.js";

class DotIterator {
    static map = null;
    idx = null;

    constructor(idx) {
        this.idx = idx;
    }

    static updateMap(map) {
        DotIterator.map = map;
    }

    hasNext() {
        const keys = Array.from(DotIterator.map.keys());

        return keys[keys.length - 1] !== this.idx;
    }

    hasPrev() {
        const keys = Array.from(DotIterator.map.keys());
        return keys[0] !== this.idx;
    }

    next() {
        const keys = Array.from(DotIterator.map.keys());
        if(!this.hasNext()) {
            this.idx = keys[0];
            store.commit('popup/updateShowDot', this.idx);
            return;
        }

        for(let i = 0; i < keys.length - 1; ++i) {
            if(keys[i] === this.idx) {
                this.idx = keys[i + 1];
                store.commit('popup/updateShowDot', this.idx);
                return;
            }
        }
    }

    prev() {
        const keys = Array.from(DotIterator.map.keys());
        if(!this.hasPrev()) {
            this.idx = keys[DotIterator.size() - 1];
            console.log(DotIterator.size() - 1);
            console.log(this.idx);
            store.commit('popup/updateShowDot', this.idx);
            return;
        }

        for(let i = 1; i < keys.length; ++i) {
            if(keys[i] === this.idx) {
                this.idx = keys[i - 1];

                store.commit('popup/updateShowDot', this.idx);
                return;
            }
        }
    }

    static size() {
        if(DotIterator.map) {
            return DotIterator.map.size;
        }
    }
}

export {
    DotIterator
}