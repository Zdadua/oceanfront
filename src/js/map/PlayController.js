import store from "../../store/index.js";
import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";
import {dayOfYear, isLeapYear} from "../tools.js";

class PlayController {
    map = null;
    date = null;
    tileList = [];
    len = 0;

    constructor(map) {
        this.map = map;
        const year = store.state['mapForTwo'].year;
        this.date = new Date(year, 0, 1);

        this.len = isLeapYear(year) ? 366 : 365;
        this.createTiles();
    }

    play() {
        let index = dayOfYear(this.date);
        for(let i = index + 5; i > index; i--) {
            if(i < this.len) {
                this.map.getLayers().insertAt(1, this.tileList[i]);
            }
        }

        this.shiftPeriodically(index);
    }

    shiftPeriodically(index) {
        index++;
        let intervalId;
        const start = () => {
            intervalId = setInterval(() => {
                this.map.getLayers().removeAt(0);
                this.map.getLayers().insertAt(5, this.tileList[index + 5]);
                index++;
            }, 300);
        }

        start();
    }

    createNextTile() {
        const nextDate = new Date(this.date);
        nextDate.setDate(this.date.getDate() + 1);

        return this.createTile(nextDate);
    }

    createTiles() {
        const year = this.date.getFullYear();

        const date = new Date(year, 0, 1);
        for(let i = 0; i < this.len; i++) {
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            const url = `http://172.20.163.79:5000/tiles/sst_tiles/${year}-${(m < 10 ? '0' + m : m)}-${(d < 10 ? '0' + d : d)}/{z}/{x}_{y}.png`;
            this.tileList[i] = new TileLayer({
                source: new XYZ({
                    url: url
                })
            })

            date.setDate(date.getDate() + 1);
        }

    }

    createTile(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const url = `http://172.20.163.79:5000/tiles/sst_tiles/${year}-${(month < 10 ? '0' + month : month)}-${(day < 10 ? '0' + day : day)}/{z}/{x}_{y}.png`;

        return new TileLayer({
            source: new XYZ({
                url: url,
            }),
        })
    }

    pause() {

    }

    setDate(date) {
        this.date = date;
    }

    test() {
        console.log(111);
    }
}

export {
    PlayController
}