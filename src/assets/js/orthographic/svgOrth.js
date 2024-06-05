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
    center = [0, 0]
    ocean = null

    rotated = true
    centered = true

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

        this.projection.rotate(this.center)

        this.svg.on('click', event => {
            let [x, y] = [event.clientX, event.clientY];
            this.center = this.projection.invert([x, y]);

            this.centered = false;
            this.paint();
        })

        getOcean().then(res => {
            this.ocean = res;

            this.paint();
        })
    }

    setProjection() {

    }

    paint() {
        this.svg.selectAll('path').remove();

        if(!this.rotated) {
            //TODO: 制作旋转过渡
        }

        if(!this.centered) {
            this.centered = true;

            let [a, b] = [this.point[0] + this.size / 2, this.point[1] + this.size / 2];
            [a, b] = this.projection.invert([a, b]);
            console.log(a + ' ' + b);
            this.projection.rotate([-this.center[0], -this.center[1]]);
        }

        this.svg.append('circle')
            .attr('cx', this.size / 2 + this.point[0])
            .attr('cy', this.size / 2 + this.point[1])
            .attr('r', this.size / 2)
            .style('stroke', 'black')
            .style('fill', '#556856')

        this.svg.append('path')
            .data(this.ocean.features)
            .style('stroke', '#174151')
            .style('fill', '#75c4e3')
            .attr('d', this.path)

        this.svg.append('path')
            .datum(this.graticule)
            .style('stroke', 'black')
            .style('opacity', .4)
            .style('fill', 'none')
            .attr('d', this.path)

        const drag = d3.drag()
            .on("start drag end", this.dragMove.bind(this));

        this.svg.call(drag);


        d3.drag()
    }

    dragMove(event) {
        const dx = event.dx;
        const dy = event.dy;

        this.projection.rotate([this.projection.rotate()[0] + dx / 10, this.projection.rotate()[1] - dy / 10]);

        // 重绘地图
        this.svg.selectAll("path")
            .attr("d", this.path);
    }

    rotate(rotateOptions) {
        this.rotated = false;
        this.rotateConfig = Object.assign(this.rotateConfig, rotateOptions);
    }

}

export {
    SvgOrthographic,
}