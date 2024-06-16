import { getCoastLine } from "../fetchData.js";

/**
 * 绘制地图轮廓线
 */

class LineDrawer {

    element = null;

    constructor(element) {
        if(element instanceof HTMLElement) {
            this.element = element;
        }
    }

    /**
     * 初始化svg，绘制轮廓线
     * @returns {Promise<void>}
     */
    async init() {
        getCoastLine().then(json => {
            if(json != null && this.element != null) {

            }
        })
    }
}