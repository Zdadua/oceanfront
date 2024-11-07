import {toLonLat} from "ol/proj";
import store from "../store/index.js";

export const depthMap = [0.494,
    1.541,
    2.646,
    3.819,
    5.078,
    6.441,
    7.930,
    9.573,
    11.405,
    13.467,
    15.810,
    18.496,
    21.599,
    25.211,
    29.445,
    34.434,
    40.344,
    47.374,
    55.764,
    65.807,
    77.854,
    92.326,
    109.729,
    130.666,
    155.851,
    186.126,
    222.475,
    266.040,
    318.127,
    380.213,
    453.938,
    541.089,
    643.567,
    763.333,
    902.339,
    1062.440,
    1245.291,
    1452.251,
    1684.284,
    1941.893].reverse();

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

function dateString(date) {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replaceAll('/', '-');
}

function daysToDate(year, days) {
    let date = new Date(year, 0, 1);
    let tmpDate = new Date(date);
    tmpDate.setDate(tmpDate.getDate() + days);

    return {
        month: tmpDate.getMonth() + 1,
        day: tmpDate.getDate(),
    }
}

export {
    coordinateToDMS,
    lonLatToDMS,
    fetchWithTimeout,
    isLeapYear,
    dayOfYear,
    sleep,
    dateString,
    daysToDate
}