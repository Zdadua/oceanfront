import * as d3 from "d3";

class LineChart {
    xScale = null;
    yScale = null;
    xDomain = null;
    yDomain = null;
    xRange = null;
    yRange = null;
    type = null;
    data = null;
    width = null;
    height = null;
    margin = {
        top: 40,
        right: 30,
        bottom: 20,
        left: 40,
    }

    svg = null;
    id = null;

    constructor(width, height, id) {
        this.svg = d3.create('svg');
        this.svg.attr('width', width)
            .attr('height', height);

        this.id = id;
    }

    createXScale(type) {
        if(type === 'linear') {
            this.xScale = d3.scaleLinear();
        }
        else if(type === 'time') {
            this.xScale = d3.scaleTime();
        }
    }

    createYScale(type) {
        if(type === 'linear') {
            this.yScale = d3.scaleLinear();
        }
        else if(type === 'time') {
            this.yScale = d3.scaleTime();
        }
    }

    setDomain(xDomain, yDomain) {
        this.XDomain(xDomain);
        this.YDomain(yDomain);
    }

    XDomain() {
        let domain = arguments[0];
        if(domain) {
            this.xDomain = domain;
        }
        else {
            return this.xDomain;
        }
    }

    YDomain() {
        let domain = arguments[0];
        if(domain) {
            this.yDomain = domain;
        }
        else {
            return this.yDomain;
        }
    }

    setMargin([top, right, bottom, left]) {
        this.margin.top = top;
        this.margin.right = right;
        this.margin.bottom = bottom;
        this.margin.left = left;

        this.xRange = [left, this.width - right];
        this.yRange = [top, this.height - bottom];
    }

    setRange(xRange, yRange) {
        this.XRange(xRange);
        this.YRange(yRange);
    }

    XRange() {
        const range = arguments[0];
        if(range) {
            this.xRange = range;
        }
        else {
            return this.xRange;
        }
    }

    YRange() {
        const range = arguments[0];
        if(range) {
            this.yRange = range;
        }
        else {
            return this.yRange;
        }
    }

    paintAxis(tickNum) {
        const xAxis = d3.axisBottom(this.xScale);

        if(tickNum) {
            xAxis.ticks(tickNum);
        }

        this.svg.append('g')
            .attr('id', `X${this.id}`)
            .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
            .call(xAxis)
            .call(g => g.select('.domain')
                .attr('stroke-opacity', 0.4)
                .attr('stroke-width', 2))
            .call(g => g.selectAll('.tick line')
                .attr('stroke-opacity', 0.4))
    }

    paintXAxis(tickNum) {
        const yAxis = d3.axisLeft(this.yScale).ticks(tickNum);
    }

    paintYAxis() {

    }

    getNode() {
        return this.svg.node();
    }

}