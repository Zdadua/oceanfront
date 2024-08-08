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
    tileToLoad = [];

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

    playTest() {
        this.prepareTiles(20);
        this.changeTile().then(() => {
            console.log('over...');
        })
    }

    preloadLayer(tileLayer) {
        return new Promise((resolve) => {
            tileLayer.set('num', 0);
            tileLayer.getSource().on('tileloadstart', () => {
                tileLayer.set('num', tileLayer.get('num') + 1);
            });

            tileLayer.getSource().on('tileloadend', () => {
                tileLayer.set('num', tileLayer.get('num') - 1);

                if(tileLayer.get('num') === 0) {
                    resolve(tileLayer);
                }
            });
        })
    }

    async changeTile() {
        let initQueue = [this.tileList[0], this.tileList[1], this.tileList[2], this.tileList[3]];
        let loadingPromises = new Map();

        for(let i = 0; i < Math.min(4, initQueue.length); i++) {
            const element = initQueue[i];
            loadingPromises.set(element, this.preloadLayer(element));
            this.map.getLayers().insertAt(i + 1, element);
        }

        while(initQueue.length > 0) {
            const firstElement = initQueue[0];
            await loadingPromises.get(firstElement);
            await sleep(1000);
            loadingPromises.delete(firstElement);
            initQueue.shift(); // 移除已经加载的第一个元素

            this.map.getLayers().insertAt(5, this.tileList[4]);
            initQueue.push(this.tileList[4]);
            loadingPromises.set(this.tileList[4], this.preloadLayer(this.tileList[4]));

            this.map.getLayers().removeAt(0);
            const tileLayer = this.createTile(this.nextDate);
            this.preLoad(tileLayer.getSource());

            store.commit('mapForTwo/addOneDay');
            this.nextDate.setDate(this.nextDate.getDate() + 1);
            this.tileList.shift();
            this.tileList.push(tileLayer);
        }
    }

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



    createTile(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const url = `http://172.20.163.79:5000/tiles/sst_tiles/${year}-${(month < 10 ? '0' + month : month)}-${(day < 10 ? '0' + day : day)}/{z}/{x}_{y}.png`;

        const tile = new TileLayer({
            source: new XYZ({
                url: url,
            }),
            transition: 0,
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