import { config } from './myConfig.js'

export async function fetchHeatMap(time) {
    const url = config.heatMap;
    if(url == null) {
        throw new Error('url is null!');
    }

    const heatResponse = await fetch(url + '/sst' + '/' + time);

    if(!heatResponse.ok) {
        throw new Error(`http error: ${heatResponse.status}`);
    }
    else {
        const text = await heatResponse.text();
        const rows = text.split('\r\n');
        rows.splice(-1, 1);
        return rows.map(row => {
            return row.split(',').map(num => {
                return parseFloat(num) || -100;
            });
        })
    }
}


export async function getOcean() {
    const response = await fetch(config.oceanPath)
    if(!response.ok) {
        throw new Error('ocean.json not get!')
    }
    return response.json();
}

async function getForeground() {
    const response = await fetch(config.foregroundPath)
    if(!response.ok) {
        throw new Error('foreground.json not get!')
    }
    return response.json();
}

async function getHeatMap() {
    const response = await fetch(config.heatMap)
    if(!response.ok) {
        throw new Error('heatMap not get!')
    }
    return response.json();
}
