import store from "../../store/index.js";
import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";
import {dayOfYear, isLeapYear, sleep} from "../tools.js";

class PlayController {
    map = null;
    date = null;
    tileList = [];
    len = 0;
    nextDate = null;

    constructor(map) {
        this.map = map;
        const year = store.state['mapForTwo'].year;
        const month = store.state['mapForTwo'].month;
        const day = store.state['mapForTwo'].day;
        this.date = new Date(year, month - 1, day);

        this.len = isLeapYear(year) ? 366 : 365;
    }

    play() {
        this.prepareTiles(20);

        for(let i = 3; i >= 0; i--) {
            this.map.getLayers().insertAt(1, this.tileList[i]);
        }

        sleep(5000).then(() => {
            let intervalId;
            const start = () => {
                intervalId = setInterval(() => {
                    this.map.getLayers().insertAt(5, this.tileList[4]);

                    const tileLayer = this.createTile(this.nextDate);
                    this.preLoad(tileLayer.getSource());
                    this.nextDate.setDate(this.nextDate.getDate() + 1);

                    setTimeout(() => {
                        this.map.getLayers().removeAt(0);
                        this.tileList.shift();
                        this.tileList.push(tileLayer);

                        store.commit('mapForTwo/addOneDay');
                    }, 100);
                }, 800);
            }
            start();
        })
    }

    // play() {
    //     // this.prepareTiles(20).then((num) => {
    //     //     for(let i = 4; i >= 0; i--) {
    //     //         this.map.getLayers().insertAt(1, this.tileList[i]);
    //     //     }
    //     //     this.len = num;
    //     //     return sleep(1000);
    //     // }).then(() => {
    //     //     let intervalId;
    //     //     const start = () => {
    //     //         intervalId = setInterval(() => {
    //     //             this.map.getLayers().item(1).setVisible(true);
    //     //             this.map.getLayers().insertAt(6, this.tileList[5]);
    //     //
    //     //             const tileLayer = this.createTile(this.nextDate);
    //     //             this.nextDate.setDate(this.nextDate.getDate() + 1);
    //     //             this.preLoad(tileLayer.getSource());
    //     //
    //     //             setTimeout(() => {
    //     //                 this.map.getLayers().removeAt(0);
    //     //                 this.tileList.shift();
    //     //                 this.tileList.push(tileLayer);
    //     //
    //     //                 store.commit('mapForTwo/addOneDay');
    //     //             }, 400);
    //     //         }, 800);
    //     //     }
    //     //     start();
    //     // })
    //
    //     this.prepareTiles(20).then(async () => {
    //         await sleep(5000)
    //     }).then(() => {
    //         let intervalId;
    //         const start = () => {
    //             intervalId = setInterval(() => {
    //                 const tileLayer = this.createTile(this.nextDate);
    //
    //                 tileLayer.getSource().once('tileloadend', () => {
    //                     console.log('over');
    //                 })
    //
    //                 this.map.getLayers().insertAt(21, tileLayer);
    //                 this.nextDate.setDate(this.nextDate.getDate() + 1);
    //
    //                 setTimeout(() => {
    //                     this.map.getLayers().removeAt(0);
    //                     store.commit('mapForTwo/addOneDay');
    //                 }, 400);
    //             }, 1200);
    //         }
    //         start();
    //     })
    //
    //     // let index = dayOfYear(this.date);
    //     // for(let i = index + 20; i > index; i--) {
    //     //     if(i < this.len) {
    //     //         this.map.getLayers().insertAt(1, this.tileList[i]);
    //     //         this.preLoad(this.tileList[i].getSource());
    //     //     }
    //     // }
    //     //
    //     // sleep(10000).then(() => {
    //     //     this.shiftPeriodically(index);
    //     // })
    // }
    //
    prepareTiles(num) {
        const year = store.state['mapForTwo'].year;
        const month = store.state['mapForTwo'].month;
        const day = store.state['mapForTwo'].day;

        let date = new Date(year, month - 1, day);

        this.nextDate = new Date(date);
        this.nextDate.setDate(date.getDate() + num + 1);

        for(let i = 0; i < num; i++) {
            date.setDate(date.getDate() + 1);
            const tileLayer = this.createTile(date);
            this.preLoad(tileLayer.getSource());
            this.tileList.push(tileLayer);
        }
    }
    //
    preLoad(source) {
        let view = this.map.getView();
        let extent = view.calculateExtent(this.map.getSize());

        let tileGrid = source.getTileGridForProjection(view.getProjection());
        tileGrid.forEachTileCoord(extent, 2, (tileCoord) => {
            const tile = source.getTile(tileCoord);
            if (tile.getState() === 0) {
                tile.load();
            }
        })
    }
    //
    // createTiles() {
    //     const year = this.date.getFullYear();
    //
    //     const date = new Date(year, 0, 1);
    //     for(let i = 0; i < this.len; i++) {
    //         const y = date.getFullYear();
    //         const m = date.getMonth() + 1;
    //         const d = date.getDate();
    //         const url = `http://172.20.163.79:5000/tiles/sst_tiles/${year}-${(m < 10 ? '0' + m : m)}-${(d < 10 ? '0' + d : d)}/{z}/{x}_{y}.png`;
    //         this.tileList[i] = new TileLayer({
    //             visible: false,
    //             preload: 1,
    //             source: new XYZ({
    //                 url: url,
    //             })
    //         })
    //
    //         date.setDate(date.getDate() + 1);
    //     }
    //
    // }
    //
    createTile(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const url = `http://172.20.163.79:5000/tiles/sst_tiles/${year}-${(month < 10 ? '0' + month : month)}-${(day < 10 ? '0' + day : day)}/{z}/{x}_{y}.png`;

        const tile = new TileLayer({
            source: new XYZ({
                url: url,
            }),
        });

        return tile;
    }

    pause() {

    }

    setDate(date) {
        this.date = date;
    }
}

export {
    PlayController
}