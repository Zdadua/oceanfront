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

function fetchWithTimeout({url, options, timeout = 10000}) {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPromise = fetch(url, {...options, signal});
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            controller.abort();
            reject(new Error('timeout'));
        }, timeout);
    })

    return Promise.race([fetchPromise, timeoutPromise]);
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function dayOfYear(date) {
    const startDate = new Date(date.getFullYear(), 0, 1);
    return Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export {
    coordinateToDMS,
    lonLatToDMS,
    fetchWithTimeout,
    isLeapYear,
    dayOfYear,
    sleep
}