import * as atatus from "atatus-spa"

const fetchStatus = async (appState) => {
    fetch(`${appState.hostAddress}/engine-status`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        appState.setEngineVersion(data.version);
    })
    .catch((error) => {
        atatus.notify(error, {}, ['status_fetch_error']);
    });
}


export default fetchStatus;