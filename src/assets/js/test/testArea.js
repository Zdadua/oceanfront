import * as d3 from "d3";


class Obj {
    constructor(date, close) {
        this.date = new Date(date);
        this.close = close;
    }
}

export async function generateChart() {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const aapl = [
        new Obj('2007-04-25', 95.5),
        new Obj('2008-04-25', 10.5),
        new Obj('2009-04-25', 78.5),
        new Obj('2010-04-25', 57.5),
        {date: new Date('2011-04-25'), close: 78.4},
    ]

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc(d3.extent(aapl, d => d.date), [marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear([0, d3.max(aapl, d => d.close)], [height - marginBottom, marginTop]);

    // Declare the area generator.
    const area = d3.area()
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.close));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Append a path for the area (under the axes).
    svg.append("path")
        .attr("fill", "steelblue")
        .attr("d", area(aapl));

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Daily close ($)"));

    return svg.node();
}

export function* rotate(context, geoJson) {
    const sphere = {type: 'Sphere'};
    let projection = d3.geoOrthographic()
        .fitExtent([[4, 4], [996, 996]], sphere)

    let path = d3.geoPath()
        .projection(projection)
        .context(context)

    const graticule = d3.geoGraticule10();

    context.strokeStyle = '#000000';

    while(true) {
        context.lineWidth = 1;
        projection.rotate([0.004 * performance.now(), -15])
        context.clearRect(0, 0, 1000, 1000);
        context.save();
        context.beginPath();
        projection.precision(0);
        context.fillStyle = "#15bc63";
        context.globalAlpha = 0.5;
        path(geoJson);
        context.fill();
        context.beginPath()
        context.lineWidth = 0.8;
        projection.precision(1);
        path(graticule);
        context.stroke();
        context.beginPath();
        path(sphere);
        context.lineWidth = 2;
        context.stroke();

        context.restore();

        yield;
    }


}