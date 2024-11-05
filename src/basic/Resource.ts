import axios from "axios";

export static class Resource {

    static async getThreeDimensionData(lon: number, lat: number, date: string) {
        // try {
        //     const dataPromise = axios.get('/data/ThreeDimension', {
        //         params: {
        //             lon: lon,
        //             lat: lat,
        //             date: date
        //         }
        //     });
        //
        //     const timeoutPromise = new Promise((_, reject) => {
        //             setTimeout(() => {
        //                 controller.abort();
        //                 reject(new Error('timeout'));
        //             }, 10000);
        //         }
        //     );
        //
        //     const response = await Promise.race([dataPromise, timeoutPromise]);
        //
        //     return response.data;
        // } catch(error) {
        //     console.error(error);
        //     return null;
        // }

        const data = [];
        for (let i = 0; i < 40; i++) {
            data.push(Math.random() * 30);
        }

        return [
            {
                'date': '2024-10-10',
                'value': data,
            }
        ]
    }

}
