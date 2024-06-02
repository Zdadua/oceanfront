import * as d3 from "d3";

class svgOrth {
    constructor(options = {}) {
        this.height = options.height || window.innerHeight;
        this.width = options.width || window.innerWidth;
        this.geoList = options.geoList || null;
        this.rotate = options.rotate || null;
        this.color = options.color || '#000';
        this.point = options.point || [0, 0];
    }

    setOptions(options = {}) {

    }

    *orthPainter() {
        let svg = d3.create('svg')
            .attr('width', this.width)
            .attr('height', this.height)

        const sphere = {type: 'Sphere'};
        const projection = d3.geoOrthographic()
            .fitExtent([this.point, [this.width - this.point[0], this.height - this.point[1]]], sphere);

        let path = d3.geoPath()
            .projection(projection);

        svg.append('path')
            .datum(this.geoList.ocean)
            .attr('d', path)


    }
}