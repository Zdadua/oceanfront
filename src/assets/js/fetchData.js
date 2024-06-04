import { config } from './myConfig.js'

export async function fetchData(url) {

    const ocean = url.ocean || null;
    const heatMap = url.heatMap || null;

    const result = {
        ocean: null,
        heatMap: null,
    }

    if(ocean != null) {
        const oceanResponse = await fetch(ocean);

        if(!oceanResponse.ok) {
            throw new Error(`http error: ${oceanResponse.status}`);
        }
        else {
            result.ocean = await oceanResponse.json();
        }

    }

    if(heatMap != null) {
        const heatResponse = await fetch(heatMap);

        if(!heatResponse.ok) {
            throw new Error(`http error: ${heatResponse.status}`);
        }
        else {
            const text = await heatResponse.text();
            const rows = text.split('\r\n');
            rows.splice(-1, 1);
            result.heatMap = rows.map(row => {
                return row.split(',').map(num => {
                    return parseFloat(num) || 0;
                });
            })
        }

    }

    return result;
}


export async function getOcean() {
    const response = await fetch(config.oceanPath)
    if(!response.ok) {
        return response.json();
    }
}

async function getForeground() {
    const response = await fetch(config.foregroundPath)
    if(!response.ok) {
        return response.json();
    }
}

async function getHeatMap() {
    const response = await fetch(config.heatMap)
    if(!response.ok) {
        return response.json();
    }
}
