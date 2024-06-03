import * as d3 from "d3";
import * as topojson from "topojson-client";

class SvgOrth {
    constructor(options = {}) {
        this.id = options.id;
        this.r = options.r || window.innerWidth;
        this.geoList = options.geoList || null;
        this.rotate = options.rotate || null;
        this.color = options.color || '#000';
        this.point = options.point || [0, 0];
    }

    setOptions(options = {}) {

    }

    *orthPainter() {
        let svg = d3.select('#' + this.id).append('svg')
            .attr('width', 2 * this.r + this.point[0])
            .attr('height', 2 * this.r + this.point[1])

        const graticule = d3.geoGraticule10();
        const sphere = {type: 'Sphere'};
        const projection = d3.geoOrthographic()
            .fitExtent([this.point, [2 * this.r - this.point[0], 2 * this.r - this.point[1]]], sphere);

        let path = d3.geoPath()
            .projection(projection);

        svg.append('circle')
            .attr('cx', this.r + this.point[0])
            .attr('cy', this.r + this.point[1])
            .attr('r', this.r)
            .style('stroke', 'black')
            .style('fill', 'none')

        svg.append('path')
            .datum(this.geoList.ocean)
            .style('fill', 'blue')
            .attr('d', path)

        svg.append('path')
            .datum(graticule)
            .style('stroke', 'black')
            .style('opacity', .3)
            .style('fill', 'none')
            .attr('d', path)

        while(true){
            svg.selectAll('path').remove();
            projection.rotate([0.004 * performance.now(), -15]);

            svg.append('path')
                .datum(this.geoList.ocean)
                .style('fill', 'blue')
                .attr('d', path)

            svg.append('path')
                .datum(graticule)
                .style('stroke', 'black')
                .style('opacity', .3)
                .style('fill', 'none')
                .attr('d', path)

            yield;
        }
    }

    paint() {
        const generator = this.orthPainter();
        let result = generator.next();

        function raf() {
            if(!result.done) {
                result = generator.next();
            }
            requestAnimationFrame(raf);
        }
        raf();
    }
}

export {
    SvgOrth,
}