import * as atatus from "atatus-spa"

const fetchRAM = async (hostAddress, notifications, controls) => {

    try {
        const result = await fetch(`${hostAddress}/get_ram_info`)
        const data = await result.json();

        controls.setAvailableRAM(Math.trunc(data.free * 1000));

    } catch (error) {
        atatus.notify(error, {}, ['ram_info_fetch_error']);
    }
}

export default fetchRAM;