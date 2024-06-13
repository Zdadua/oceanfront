import * as d3 from 'd3'
import { fetchHeatMap } from "../fetchData.js";

class HeatMap {

    url = null;
    heatData = null;
    ctx = null;
    projection = d3.geoOrthographic().fitExtent([[0, 0], [1000, 1000]], {type: 'Sphere'}).clipAngle(90);
    path = d3.geoPath();

    constructor(ctx) {
        this.ctx = ctx;
        if(arguments.length >= 2) {
            if(typeof arguments[1] == 'string') {
                this.url = arguments[1];
            }
        }

        this.path.context(this.ctx).projection(this.projection);
    }

    async init() {
        if(this.url == null) {
            throw new Error('url is null')
        }

        this.heatData = await fetchHeatMap(this.url);

        const min = parseInt(d3.min(this.heatData.flat()));
        const max = parseInt(d3.max(this.heatData.flat()));

        let tmpCanvas = d3.create('canvas').attr('width', 2880).attr('height', 1440);
        let tmpCtx = tmpCanvas.node().getContext('2d');

        const colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["blue", "green", "yellow", "red", "purple"])).domain([min, max]);
        let color;
        this.heatData.forEach((d, i) => {
            for(let j = 0; j < 1440; j++) {
                color = colorScale(d[(j + 1440) % 1440]);
                tmpCtx.fillStyle = color;
                tmpCtx.beginPath();
                tmpCtx.arc(2 * j, 2 *(720 - i), 3, 0, 2 * Math.PI);
                tmpCtx.fill();
            }
        })

        return tmpCtx.getImageData(0, 0, 2880, 1440);

    }
}

export {
    HeatMap,
}