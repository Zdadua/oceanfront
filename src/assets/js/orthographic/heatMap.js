import * as d3 from 'd3'
import { fetchHeatMap } from "../fetchData.js";

class HeatMap {

    time = null;
    heatData = null;
    ctx = null;
    projection = d3.geoOrthographic().fitExtent([[0, 0], [1000, 1000]], {type: 'Sphere'}).clipAngle(90);
    path = d3.geoPath();

    constructor(ctx) {
        this.ctx = ctx;
        if(arguments.length >= 2) {
            if(typeof arguments[1] == 'string') {
                this.time = arguments[1];
            }
        }

        this.path.context(this.ctx).projection(this.projection);
    }

    async init() {
        this.heatData = await fetchHeatMap(this.time);

        const tmp = this.heatData.flat();

        let min = 100;
        for(let num in tmp) {
            if(num == -100) continue;
            min = min < num ? min : num;
        }
        const max = parseInt(d3.max(this.heatData.flat()));

        let tmpCanvas = d3.create('canvas').attr('width', 4320).attr('height', 2160);
        let tmpCtx = tmpCanvas.node().getContext('2d');

        const colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["rgb(55,55,138)", "rgba(119,250,119,0.84)", "rgb(239,224,92)", "rgb(255,55,55)", "#9B00FFB3"])).domain([min, max]);
        let color;
        this.heatData.forEach((d, i) => {
            for(let j = 0; j < 1440; j++) {
                color = d[(j + 1440) % 1440] != -100 ? colorScale(d[(j + 1440) % 1440]) : '#2b2b2b';
                tmpCtx.fillStyle = color;
                tmpCtx.beginPath();
                tmpCtx.arc(3 * j, 3 *(720 - i), 3, 0, 2 * Math.PI);
                tmpCtx.fill();
            }
        })

        return tmpCtx.getImageData(0, 0, 4320, 2160);

    }
}

export {
    HeatMap,
}