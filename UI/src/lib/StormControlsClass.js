import ValidateStormData from "./ValidateStormData";

class StormControlsClass {
    constructor(hostAddress) {
        this.hostAddress = hostAddress;
        this.setPausing = null;
        this.setStopping = null;
        this.setResuming = null;
        this.setControlsDisabled = null;
        this.notifications = null;
    }

    startStorm(formControls) {

        const dataValid = ValidateStormData(formControls);

        if (!dataValid) {
            return;
        }

        formControls.setLoading(true);
        this.setControlsDisabled(true);

        fetch(`${this.hostAddress}/storm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formControls.getStormData()),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.notifications.show('Storm started successfully!', {
                        severity: 'success',
                    });
                    this.setControlsDisabled(false);
                    formControls.setStormInProgress(true);
                } else {
                    formControls.setErrorText(data.message || 'Request failed');
                    this.notifications.show("Failed to start storm", {
                        severity: 'error',
                    });
                }
            })
            .catch(error => {
                console.error('Error starting storm:', error);
                this.notifications.show(error.message || 'An error occurred while starting the storm', {
                    severity: 'error',
                });
            })
            .finally(() => {
                formControls.setLoading(false);
                this.setControlsDisabled(false);
            });
    }

    stopStorm(setStormInProgress) {
        this.setStopping(true);
        this.setControlsDisabled(true);

        fetch(`${this.hostAddress}/stop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setStormInProgress(false);
                    this.notifications.show('Storm stopped successfully!', {
                        severity: 'success',
                    });
                }
            })
            .catch(error => {
                console.error('Error stopping storm:', error);
                this.notifications.show('An error occurred while stopping the storm', {
                    severity: 'error',
                });
            })
            .finally(() => {
                this.setStopping(false);
                this.setControlsDisabled(false);
            });

    }

    pauseStorm() {
        this.setPausing(true);
        this.setControlsDisabled(true);

        fetch(`${this.hostAddress}/pause`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.notifications.show('Storm paused successfully!', {
                        severity: 'success',
                    });
                }
            })
            .catch(error => {
                console.error('Error pausing storm:', error);
                this.notifications.show('An error occurred while pausing the storm', {
                    severity: 'error',
                });
            })
            .finally(() => {
                this.setPausing(false);
                this.setControlsDisabled(false);
            });
    }


    resumeStorm() {
        this.setResuming(true);
        this.setControlsDisabled(true);

        fetch(`${this.hostAddress}/resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.notifications.show('Storm resumed successfully!', {
                        severity: 'success',
                    });
                }
            })
            .catch(error => {
                console.error('Error resuming storm:', error.name);
                this.notifications.show('An error occurred while resuming the storm', {
                    severity: 'error',
                });
            })
            .finally(() => {
                this.setResuming(false);
                this.setControlsDisabled(false);
            });
    }
}

export default StormControlsClass;