// import * as d3 from "d3";
// export default function* orthPainter(cntx, obj) {
//     // canvas宽度
//     const width = obj.width || 500;
//     // canvas高度
//     const height = obj.height || 500;
//     // 左上角
//     const point = obj.point || [0, 0];
//     const sphere = {type: 'Sphere'};
//     // 正交投影
//     const projection = d3.geoOrthographic();
//     const path = d3.geoPath()
//         .context(cntx)
//         .projection(projection);
//     // 10度划分的经纬网
//     const graticule = d3.geoGraticule10();
//
//     cntx.strokeStyle = '#000';
//     cntx.lineWidth = 1;
//     cntx.save();
//     while(true) {
//         cntx.clearRect(0, 0, width, height);
//
//         cntx.lineWidth = 2;
//         cntx.beginPath();
//         path(sphere);
//         cntx.stroke();
//
//         cntx.restore();
//         yield;
//     }
// }

class CanvasOrth {
    constructor(options = {}) {
        this.context = options.context || null;
        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;
        this.geoList = options.geoList || null;
        this.rotate = options.rotate || null;
        this.color = options.color || '#000';
        this.point = options.point || [0, 0];
    }

    coverOptions(options) {
        this.context = Object.assign(this.context, options.context);
        this.geoList = Object.assign(this.geoList, options.geoList);
        this.rotate = Object.assign(this.rotate, options.rotate);
    }

    setOptions(options) {
        this.context = options.context || this.context;
        this.geoList = options.geoList || this.geoList;
        this.rotate = options.rotate || this.rotate;
        this.width = options.width || this.width;
        this.height = options.height || this.width;
        this.point = options.point || this.point;
    }

    *orthPainter() {
        if(this.context == null) {
            throw new Error("No context provided!");
        }

        const sphere = {type: 'Sphere'};
        const projection = d3.geoOrthographic()
            .fitExtent([this.point, [this.width, this.height]], sphere);
        const path = d3.geoPath()
            .context(this.context)
            .projection(projection);

        const graticule = d3.geoGraticule10();

        this.context.strokeStyle = this.color;
        this.context.lineWidth = 1;
        this.context.save();

        while(true) {
            this.context.clearRect(0, 0, this.width, this.height);

            this.context.beginPath();
            path(graticule);
            this.context.stroke();

            for(let geo in this.geoList) {
                this.context.beginPath();
                this.context.fillStyle = geo.color;
                path(geo.geoJson);
                this.context.fill();
            }

            this.context.beginPath();
            this.context.lineWidth = 2;
            path(sphere);
            this.context.stroke();

            this.context.restore();
            yield;
        }
    }

    paint() {
        const generator = this.orthPainter();
        let result = generator.next();

        function raf() {
            while(result.done) {
                result = generator.next();
            }
            requestAnimationFrame(raf);
        }

        raf();
    }

}
