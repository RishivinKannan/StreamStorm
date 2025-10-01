import * as atatus from 'atatus-spa';

const ValidateStormData = (formControls, systemInfoControls) => {
    let isValid = true;

    if (!formControls.videoURL) {
        isValid = false;
        formControls.setVideoURLError(true);
        formControls.setVideoURLHelperText('Video URL is required.');
    } else {
        try {
            let url = new URL(formControls.videoURL);

            if (url.hostname != 'www.youtube.com') {
                isValid = false;
                formControls.setVideoURLError(true);
                formControls.setVideoURLHelperText(
                    'Invalid Video URL. Must be a YouTube link.'
                );
            } else if (!url.search.startsWith('?v=')) {
                isValid = false;
                formControls.setVideoURLError(true);
                formControls.setVideoURLHelperText(
                    'Invalid Youtube Video Link.'
                );
            } else if (url.pathname != '/watch') {
                isValid = false;
                formControls.setVideoURLError(true);
                formControls.setVideoURLHelperText(
                    'Invalid Youtube Video Link.'
                );
            }
        } catch (e) {
            atatus.notify(e, {}, ['video_url_validation_error']);
            isValid = false;
            formControls.setVideoURLError(true);
            formControls.setVideoURLHelperText('Invalid Video URL.');
        }
    }

    if (formControls.messages.length === 0) {
        isValid = false;
        formControls.setMessagesError(true);
        formControls.setMessagesHelperText('At least one message is required.');
    }

    if (isNaN(formControls.slowMode)) {
        isValid = false;
        formControls.setSlowModeError(true);
        formControls.setSlowModeHelperText('Enter a value for slow mode.');
    }

    if (formControls.slowMode < 1) {
        isValid = false;
        formControls.setSlowModeError(true);
        formControls.setSlowModeHelperText(
            'Slow mode must be at least 1 seconds.'
        );
    }

    if (formControls.subscribeAndWait) {
        if (isNaN(formControls.subscribeWaitTime)) {
            isValid = false;
            formControls.setSubscribeWaitTimeError(true);
            formControls.setSubscribeWaitTimeHelperText(
                'Enter a valid number for subscribe wait time.'
            );
        } else if (formControls.subscribeWaitTime < 1) {
            isValid = false;
            formControls.setSubscribeWaitTimeError(true);
            formControls.setSubscribeWaitTimeHelperText(
                'Enter a valid number for subscribe wait time.'
            );
        }
    }

    if (formControls.channelSelection === 'basic') {
        if (isNaN(formControls.noOfChannels)) {
            isValid = false;
            formControls.setNoOfChannelsError(true);
            formControls.setNoOfChannelsHelperText(
                'Enter a valid number of channels.'
            );
        } else if (formControls.noOfChannels < 1) {
            isValid = false;
            formControls.setNoOfChannelsError(true);
            formControls.setNoOfChannelsHelperText(
                'Number of channels must be at least 1.'
            );
        } else if (
            formControls.noOfChannels >
            systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE
        ) {
            isValid = false;
            formControls.setErrorText(
                `You can run a maximum of ${Math.floor(systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE)} channels with your available RAM.`
            );
        }
    } else if (formControls.channelSelection === 'intermediate') {
        if (isNaN(formControls.startChannelIndex)) {
            isValid = false;
            formControls.setStartChannelIndexError(true);
            formControls.setStartChannelIndexHelperText(
                'Enter a valid start channel index.'
            );
        } else if (formControls.startChannelIndex < 1) {
            isValid = false;
            formControls.setStartChannelIndexError(true);
            formControls.setStartChannelIndexHelperText(
                'Start channel index must be at least 1.'
            );
        }

        if (isNaN(formControls.endChannelIndex)) {
            isValid = false;
            formControls.setEndChannelIndexError(true);
            formControls.setEndChannelIndexHelperText(
                'Enter a valid end channel index.'
            );
        } else if (
            formControls.endChannelIndex < formControls.startChannelIndex
        ) {
            isValid = false;
            formControls.setEndChannelIndexError(true);
            formControls.setEndChannelIndexHelperText(
                'End channel index cannot be less than start channel index.'
            );
        }

        const totalChannels =
            formControls.endChannelIndex - formControls.startChannelIndex + 1;
        if (
            totalChannels >
            systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE
        ) {
            isValid = false;
            formControls.setErrorText(
                `You can run a maximum of ${Math.floor(systemInfoControls.availableRAM / systemInfoControls.RAM_PER_PROFILE)} channels with your available RAM.`
            );
        }
    }

    if (systemInfoControls.availableRAM === null) {
        isValid = false;
        formControls.setErrorText(
            'Not enough RAM to run even one channel. If this is a mistake, Refresh RAM and try again.'
        );
    }

    return isValid;
};

export default ValidateStormData;
