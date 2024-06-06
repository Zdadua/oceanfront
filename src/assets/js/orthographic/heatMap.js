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

        const min = d3.min(this.heatData.flat());
        const max = d3.max(this.heatData.flat());

        console.log(min + ' ' + max)

        const colorScale = d3.scaleSequential(d3.interpolate('blue', 'red')).domain([min, max]);

        this.heatData.forEach((d, i) => {

            for(let j = -360; j < 360; j++) {
                let [x, y] = this.projection([ j / 4, -(360 - i) / 4])

                const color = colorScale(d[(j + 1440) % 1440]);
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                // this.ctx.arc(j, 720 - i, 5, 0, 2 * Math.PI);
                this.ctx.fill();
            }


        })

    }
}

export {
    HeatMap,
}