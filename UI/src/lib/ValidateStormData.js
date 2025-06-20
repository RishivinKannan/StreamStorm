

const ValidateStormData = (formControls) => {
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

    if (formControls.slowMode < 5) {
        isValid = false;
        formControls.setSlowModeError(true);
        formControls.setSlowModeHelperText("Slow mode must be at least 5 seconds.");
    }

    if (formControls.subscribeAndWait && formControls.subscribeWaitTime < 0) {
        isValid = false;
        formControls.setSubscribeWaitTimeError(true);
        formControls.setSubscribeWaitTimeHelperText("Subscribe wait time cannot be negative.");
    }

    if (formControls.accountSelection === 'basic') {
        if (formControls.noOfAccounts < 1) {
            isValid = false;
            formControls.setNoOfAccountsError(true);
            formControls.setNoOfAccountsHelperText("Number of accounts must be at least 1.");
        }
    } else if (formControls.accountSelection === 'advanced') {
        if (formControls.startAccountIndex < 1) {
            isValid = false;
            formControls.setStartAccountIndexError(true);
            formControls.setStartAccountIndexHelperText("Start account index must be at least 1.");
        }
        if (formControls.endAccountIndex < formControls.startAccountIndex) {
            isValid = false;
            formControls.setEndAccountIndexError(true);
            formControls.setEndAccountIndexHelperText("Cannot be less than start account index.");
        }
    }

    if (!formControls.browser) {
        isValid = false;
        formControls.setBrowserError(true);
        formControls.setBrowserHelperText("Select a browser.");
    }

    return isValid;
};


export default ValidateStormData;
