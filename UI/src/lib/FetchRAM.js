const fetchRAM = async (hostAddress, notifications, controls) => {

    try {
        const result = await fetch(`${hostAddress}/get_ram_info`)
        const data = await result.json();

        controls.setAvailableRAM(Math.trunc(data.free * 1000));

    } catch (error) {
        console.error("Error fetching RAM data:", error);
        // notifications.show("Failed to fetch RAM data", {
        //     severity: 'error',
        // });
    }
}

export default fetchRAM;