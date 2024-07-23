import {toLonLat} from "ol/proj";
import store from "../store/index.js";

function coordinateToDMS(coordinate) {
    return lonLatToDMS(toLonLat(coordinate));
}

function lonLatToDMS(lon, lat) {
    let absLon = Math.abs(lon);
    let lonD = Math.floor(absLon); // 度
    let lonM = Math.floor((absLon - lonD) * 60); // 分
    lonM = lonM < 10 ? '0' + lonM : lonM;
    let lonS = Math.floor((absLon - lonD - lonM / 60) * 3600); // 秒
    lonS = lonS < 10 ? '0' + lonS : lonS;

    let absLat = Math.abs(lat); // 取绝对值以便计算
    let latD = Math.floor(absLat); // 度
    let latM = Math.floor((absLat - latD) * 60); // 分
    latM = latM < 10 ? '0' + latM : latM;
    let latS = Math.floor((absLat - latD - latM / 60) * 3600); // 秒
    latS = latS < 10 ? '0' + latS : latS;

    return {
        lonPassive: lon > 0 ? 1 : -1,
        lonD: lonD,
        lonM: lonM,
        lonS: lonS,
        latPassive: lat > 0 ? 1 : -1,
        latD: latD,
        latM: latM,
        latS: latS
    }
}


export {
    coordinateToDMS,
    lonLatToDMS
}