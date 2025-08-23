const fetchStatus = async (formControls) => {
    fetch(`${formControls.hostAddress}/engine-status`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        formControls.setStormInProgress(data.storm_in_progress);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


export default fetchStatus;