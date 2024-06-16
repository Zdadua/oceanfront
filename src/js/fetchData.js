import { config } from './myConfig.js'

class ResourceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResourceError';
    }
}

const sourcePath = config.source;

export async function getHeatMap(time) {
    const api = getAPI('heatMap');

    if(api == null) {
        console.log('heatMap API does not exist!');
        return null;
    }

    const regex = /^\\d4-\\d2-\\d2$/;
    if(!regex.test(time)) {
        throw new Error('time is not illegal!');
    }

    const heatResponse = await fetch(sourcePath + api + '/' + time);

    if(!heatResponse.ok) {
        throw new ResourceError(`http error: ${heatResponse.status}`);
    }

    const text = await heatResponse.text();
    // 将csv文件切为720行
    const rows = text.split('\r\n');
    // 最后一行为空行，故删除
    rows.splice(-1, 1);
    return rows.map(row => {
        return row.split(',').map(num => {
            return parseFloat(num) || -100; // 没有的数据(N)置为-100，分开染色
        });
    })

}

export async function getCoastLine() {
    const local = getAPI('coastLine');

    if(local == null) {
        console.log('coastLine Path does not exist!');
        return null;
    }

    const response = await fetch(local);

    if(!response.ok) {
        console.log('remoteCoastLine geoJson does not exist!');
        return null;
    }

    return response.json();
}

/**
 * 检查该获取资源的api是否存在
 * @param name
 * @returns {*} 返回对应的api字符串
 */
function getAPI(name) {
    return config[name] || null;
}
