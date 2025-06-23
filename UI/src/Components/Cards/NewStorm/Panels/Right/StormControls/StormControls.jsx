import { useContext, useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { useColorScheme } from '@mui/material/styles';
import { Ban, Pause, Play, RefreshCw, SquarePen, Zap } from 'lucide-react';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useDialogs } from '@toolpad/core/useDialogs';

import "./StormControls.css";
import { CustomMUIPropsContext, StormDataContext, } from "../../../../../../lib/ContextAPI";
import AreYouSure from "../../../../../Dialogs/AreYouSure";
import Ping from "../../../../../Elements/Ping/Ping";
import StormControlsClass from "../../../../../../lib/StormControlsClass";
import ChangeMessages from "../../../../../Dialogs/ChangeMessages";

const StormControls = () => {

    const { btnProps } = useContext(CustomMUIPropsContext);
    const formControls = useContext(StormDataContext);
    const { colorScheme } = useColorScheme();
    const dialogs = useDialogs();

    const [pausing, setPausing] = useState(false);
    const [stopping, setStopping] = useState(false);
    const [resuming, setResuming] = useState(false);
    const [dontWaitLoading, setDontWaitLoading] = useState(false);
    const [changeMessagesLoading, setChangeMessagesLoading] = useState(false);
    const [controlsDisabled, setControlsDisabled] = useState(false);

    useEffect(() => {
        formControls.SC.current = new StormControlsClass(formControls.hostAddress);
        formControls.SC.current.setPausing = setPausing;
        formControls.SC.current.setStopping = setStopping;
        formControls.SC.current.setResuming = setResuming;
        formControls.SC.current.setControlsDisabled = setControlsDisabled;
        formControls.SC.current.setDontWaitLoading = setDontWaitLoading;
        formControls.SC.current.setChangeMessagesLoading = setChangeMessagesLoading;
        formControls.SC.current.notifications = formControls.notifications;
    }, [formControls.hostAddress]);


    const onStopHandler = async () => {

        const confirmed = await dialogs.open(AreYouSure, {
            text: <span>Are you sure you want to <strong style={{ color: "var(--input-active-red-dark)" }}>STOP</strong> the ongoing storm?</span>
        });

        if (confirmed) {
            formControls.SC.current.stopStorm(formControls.setStormInProgress);
            // formControls.setStormInProgress(false);
        }

    }

    const handlePause = async () => {
        formControls.SC.current.pauseStorm();
    };

    const handleResume = async () => {
        formControls.SC.current.resumeStorm();
    };

    const handleChangeMessages = async () => {
        const messages = await dialogs.open(ChangeMessages, {
            formControls: formControls,
        });
        if (!messages) return;
        formControls.SC.current.changeMessages(messages);
    }

    const handleDontWait = async () => {
        formControls.SC.current.dontWait();
    };

    return (
        <div className="storm-controls-container">
            <div className='storm-controls-heading-container'>
                <Zap className='zap-icon' size={20} color={colorScheme === 'light' ? "var(--input-active-red-light)" : "var(--input-active-red-dark)"} />
                <h3 className={`storm-controls-title`}>Storm Controls</h3>
            </div>

            {
                formControls.stormInProgress &&
                <div className={`storm-in-progress-container ${colorScheme}-bordered-container`}>
                    <Ping />
                    <span className={`storm-in-progress-text ${colorScheme}-text`}>A Storm is in progress...</span>
                </div>
            }



            <div className="storm-controls-btns-container">
                <div className="row">
                    <Button
                        variant="contained"
                        startIcon={pausing ? <RefreshCw size={20} className="spin" /> : <Pause size={20} />}
                        sx={btnProps}
                        onClick={handlePause}
                        disabled={controlsDisabled || !formControls.stormInProgress}
                    >
                        {
                            pausing ? "Pausing..." : "Pause"
                        }
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={resuming ? <RefreshCw size={20} className="spin" /> : <Play size={20} />}
                        sx={btnProps}
                        onClick={handleResume}
                        disabled={controlsDisabled || !formControls.stormInProgress}
                    >
                        {
                            resuming ? "Resuming..." : "Resume"
                        }
                    </Button>
                </div>
                <div className="row">
                    <Button
                        variant="contained"
                        startIcon={changeMessagesLoading ? <RefreshCw size={20} className="spin" /> : <SquarePen size={20} />}
                        sx={{
                            ...btnProps,
                            height: "60px",
                        }}
                        onClick={handleChangeMessages}
                        disabled={controlsDisabled || !formControls.stormInProgress}
                    >
                        {
                            changeMessagesLoading ? "Processing..." : "Change Messages"
                        }
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={dontWaitLoading ? <RefreshCw size={20} className="spin" /> : <Ban size={20} />}
                        sx={{
                            ...btnProps,
                            height: "60px",
                        }}
                        onClick={handleDontWait}
                        disabled={controlsDisabled || !formControls.stormInProgress}
                    >
                        {
                            dontWaitLoading ? "Processing..." : "Don't Wait"
                        }
                    </Button>
                </div>

                <Button
                    variant="contained"
                    startIcon={stopping ? <RefreshCw size={20} className="spin" /> : <StopCircleIcon />}
                    onClick={onStopHandler}
                    sx={{
                        ...btnProps,
                        backgroundColor: colorScheme === 'light' ? "var(--bright-red-2)" : "var(--input-active-red-dark)",
                        color: "var(--light-text)",
                    }}
                    disabled={controlsDisabled}
                >
                    {
                        stopping ? "Stopping Storm..." : "Stop"
                    }
                </Button>
            </div>
        </div>
    );
}
export default StormControls;
