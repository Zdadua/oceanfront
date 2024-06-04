import * as d3 from "d3";
import { getOcean } from '../fetchData.js'

class SvgOrthographic {

    projection= d3.geoOrthographic();
    sphere = {type: 'Sphere'}
    size = 500
    rotateConfig= {
        auto: false,
        speed: 0,
        autoVector: [0, 0, 0],
        angle: [0, 0, 0]
    }

    rotated = true

    point= [0, 0]
    path = d3.geoPath()
    svg = null
    graticule = d3.geoGraticule10()

    constructor(options = {}) {
        if(options.svgId == null) {
            throw new Error('No Container!');
        }

        this.svg = d3.select(`#${options.svgId}`);
        this.size = options.size || this.size;
        this.point = options.point || this.point;
    }

    init() {
        this.projection.fitExtent([this.point, [this.size - this.point[0], this.size - this.point[1]]], this.sphere);
        this.path.projection(this.projection);

        this.svg.append('path')
            .datum(this.graticule)
            .style('stroke', 'black')
            .style('opacity', .4)
            .style('fill', 'none')
            .attr('d', this.path)

        this.svg.append('circle')
            .attr('cx', this.size / 2 + this.point[0])
            .attr('cy', this.size / 2 + this.point[1])
            .attr('r', this.size / 2)
            .style('stroke', 'black')
            .style('fill', 'none')
    }

    setProjection() {

    }

    repaint() {

    }

    rotate(rotateOptions) {
        this.rotated = false;
        this.rotateConfig = Object.assign(this.rotateConfig, rotateOptions);
    }

}

export {
    SvgOrthographic,
}