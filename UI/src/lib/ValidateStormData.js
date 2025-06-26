import SystemInfo from "../Components/Cards/SystemInfo/SystemInfo";


const ValidateStormData = (formControls, systemInfoControls) => {
    let isValid = true;

    if (!formControls.videoURL) {
        isValid = false;
        formControls.setVideoURLError(true);
        formControls.setVideoURLHelperText("Video URL is required.");
    } else {
        try {
            let url = new URL(formControls.videoURL);

            if (url.hostname != "www.youtube.com") {
                isValid = false;
                formControls.setVideoURLError(true);
                formControls.setVideoURLHelperText("Invalid Video URL. Must be a YouTube link.");
            } else if (!url.search.startsWith('?v=')) {
                isValid = false;
                formControls.setVideoURLError(true);
                formControls.setVideoURLHelperText("Invalid Youtube Video Link.");
            } else if (url.pathname != "/watch") {
                isValid = false;
                formControls.setVideoURLError(true);
                formControls.setVideoURLHelperText("Invalid Youtube Video Link.");
            }
        } catch (e) {
            console.log(e);
            isValid = false;
            formControls.setVideoURLError(true);
            formControls.setVideoURLHelperText("Invalid Video URL.");
        }
    }

    if (formControls.messages.length === 0) {
        isValid = false;
        formControls.setMessagesError(true);
        formControls.setMessagesHelperText("At least one message is required.");
    }

    if (isNaN(formControls.slowMode)) {
        isValid = false;
        formControls.setSlowModeError(true);
        formControls.setSlowModeHelperText("Enter a value for slow mode.");
    }

    if (formControls.slowMode < 1) {
        isValid = false;
        formControls.setSlowModeError(true);
        formControls.setSlowModeHelperText("Slow mode must be at least 1 seconds.");
    }

    if (formControls.subscribeAndWait) {
        if (isNaN(formControls.subscribeWaitTime)) {
            isValid = false;
            formControls.setSubscribeWaitTimeError(true);
            formControls.setSubscribeWaitTimeHelperText("Enter a valid number for subscribe wait time.");
        } else if (formControls.subscribeWaitTime < 1) {
            isValid = false;
            formControls.setSubscribeWaitTimeError(true);
            formControls.setSubscribeWaitTimeHelperText("Enter a valid number for subscribe wait time.");
        }
    }

    if (formControls.accountSelection === 'basic') {
        if (isNaN(formControls.noOfAccounts)) {
            isValid = false;
            formControls.setNoOfAccountsError(true);
            formControls.setNoOfAccountsHelperText("Enter a valid number of accounts.");
        } else if (formControls.noOfAccounts < 1) {
            isValid = false;
            formControls.setNoOfAccountsError(true);
            formControls.setNoOfAccountsHelperText("Number of accounts must be at least 1.");
        } else if (formControls.noOfAccounts > (systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE)) {
            isValid = false;
            formControls.setErrorText(`You can run a maximum of ${Math.floor(systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE)} accounts with your available RAM.`);
        }
    } else if (formControls.accountSelection === 'advanced') {
        if (isNaN(formControls.startAccountIndex)) {
            isValid = false;
            formControls.setStartAccountIndexError(true);
            formControls.setStartAccountIndexHelperText("Enter a valid start account index.");
        } else if (formControls.startAccountIndex < 1) {
            isValid = false;
            formControls.setStartAccountIndexError(true);
            formControls.setStartAccountIndexHelperText("Start account index must be at least 1.");
        }
        
        if (isNaN(formControls.endAccountIndex)) {
            isValid = false;
            formControls.setEndAccountIndexError(true);
            formControls.setEndAccountIndexHelperText("Enter a valid end account index.");
        } else if (formControls.endAccountIndex < formControls.startAccountIndex) {
            isValid = false;
            formControls.setEndAccountIndexError(true);
            formControls.setEndAccountIndexHelperText("End account index cannot be less than start account index.");
        }

        const totalAccounts = formControls.endAccountIndex - formControls.startAccountIndex + 1;
        if (totalAccounts > (systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE)) {
            isValid = false;
            formControls.setErrorText(`You can run a maximum of ${Math.floor(systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE)} accounts with your available RAM.`);
        }
    }

    if (!formControls.browser) {
        isValid = false;
        formControls.setBrowserError(true);
        formControls.setBrowserHelperText("Select a browser.");
    }

    if (systemInfoControls.availableRAM === null) {
        isValid = false;
        formControls.setErrorText("Not enough RAM to run even one account. If this is a mistake, Refresh RAM and try again.");
    }

    return isValid;
};


export default ValidateStormData;
