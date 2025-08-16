const fetchStatus = async (formControls) => {
    fetch(`${formControls.hostAddress}/engine-status`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.storm_in_progress) {
            formControls.setStormInProgress(false);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


export default fetchStatus;