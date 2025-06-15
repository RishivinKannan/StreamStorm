import { useContext, useState } from "react";
import { Button } from "@mui/material";
import { useColorScheme } from '@mui/material/styles';
import { Zap } from 'lucide-react';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useDialogs } from '@toolpad/core/useDialogs';

import "./StormControls.css";
import { customMUIProps } from "../../../../../../lib/ContextAPI";
import AreYouSure from "../../../../../Dialogs/AreYouSure/AreYouSure";

const StormControls = () => {

    const { btnProps } = useContext(customMUIProps);
    const { colorScheme } = useColorScheme();
    const dialogs = useDialogs();

    const [pausing, setPausing] = useState(false);
    const [stopping, setStopping] = useState(false);


    const onStopHandler = async () => {
        const confirmed = await dialogs.open(AreYouSure, {
            text: "Are you sure you want to stop the ongoing storm?"
        });
        console.log(confirmed);
    }

    const handlePause = () => {
        
    };


    return (
        <div className="storm-controls-container">
            <div className='storm-controls-heading-container'>
                <Zap className='zap-icon' size={20} color={colorScheme === 'light' ? "var(--input-active-red-light)" : "var(--input-active-red-dark)"} />
                <h3 className={`storm-controls-title`}>Storm Controls</h3>
            </div>

            <div className="storm-controls-btns-container">
                <Button
                    variant="contained"
                    startIcon={<PauseIcon />}
                    sx={btnProps}
                >
                    Pause
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    sx={btnProps}
                >
                    Resume
                </Button>

                <Button
                    variant="contained"
                    startIcon={<StopCircleIcon />}
                    onClick={onStopHandler}
                    sx={{
                        ...btnProps,
                        backgroundColor: colorScheme === 'light' ? "var(--bright-red-2)" : "var(--dark-red-2)",
                        '&:hover': {
                            backgroundColor: colorScheme === 'light' ? "#EF4444E6" : "#7F1D1DE6",
                            boxShadow: "none",
                        },
                        color: "var(--light-text)",
                    }}
                >
                    Stop
                </Button>
            </div>
        </div>
    );
}
export default StormControls;
