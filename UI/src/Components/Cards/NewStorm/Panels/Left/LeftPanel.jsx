import { useState, useContext } from "react";
import { useColorScheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { Radio, RadioGroup } from "@mui/material";

import "./LeftPanel.css";
import { customMUIPropsContext } from "../../../../../lib/ContextAPI";

const LeftPanel = () => {

    const [accountSelection, setAccountSelection] = useState('basic');
    const { colorScheme } = useColorScheme();
    const {inputProps} = useContext(customMUIPropsContext);

    return (
        <div className="left-panel-container">
            <TextField
                variant="outlined"
                sx={inputProps}
                label="Video URL"
                helperText="Enter the URL of the video to be used in the storm."
            />

            <TextField
                multiline
                rows={4}
                variant="outlined"
                label="Messages"
                sx={inputProps}
            />

            <div className="left-panel-switches-container">
                <div className={`switch-container ${colorScheme}-bordered-container`}>
                    <span className="switch-label">Subscribe</span>
                    <Switch
                        color="primary"
                    />
                </div>
                <div className={`switch-container ${colorScheme}-bordered-container`}>
                    <span className="switch-label">Subscribe & Wait</span>
                    <Switch
                        color="primary"
                    />
                </div>
            </div>

            <div className="times-input-container">
                <TextField
                    type="number"
                    variant="outlined"
                    label="Wait Time (s)"
                    helperText="Waiting time for each message"
                    className="time-input"
                    sx={inputProps}
                    defaultValue={5}

                />

                <TextField
                    type="number"
                    variant="outlined"
                    label="Slow Mode (s)"
                    helperText="Slow mode time."
                    className="time-input dark-bordered-container"
                    sx={inputProps}

                />
            </div>

            <div className="account-index-inputs-container">
                <span className="account-index-input-heading">Accounts Selection</span>

                <div className="account-index-input-radio-container">
                    <RadioGroup
                        row
                        defaultValue="basic"
                        name="account-index-radio-group"
                        onChange={(e) => setAccountSelection(e.target.value)}
                    >
                        <div className="account-index-radio-container">
                            <Radio
                                value="basic"
                                color="primary"
                            />
                            <span className="account-index-input-label">Basic</span>
                        </div>
                        <div className="account-index-radio-container">
                            <Radio
                                value="advanced"
                                color="primary"
                            />
                            <span className="account-index-input-label">Advanced</span>
                        </div>
                    </RadioGroup>
                </div>
                {
                    accountSelection === "basic" ? (
                        <div className="account-selection-basic-container">
                            <TextField
                                type="number"
                                defaultValue={1}
                                variant="outlined"
                                label="No.of Accounts"
                                helperText="Enter the number of accounts"
                                className="account-index-input"
                                sx={inputProps}
                            />
                        </div>
                    ) : (
                        <div className="account-selection-advanced-container">
                            <TextField
                                type="number"
                                defaultValue={1}
                                variant="outlined"
                                label="Start Account Index"
                                helperText="Enter the start index"
                                className="account-index-input"
                                sx={inputProps}
                            />
                            <TextField
                                type="number"
                                // defaultValue={5}
                                variant="outlined"
                                label="End Account Index"
                                helperText="Enter the end index"
                                className="account-index-input"
                                sx={inputProps}
                            />
                        </div>
                    )
                }
                {
                    accountSelection === "advanced" ? (
                        <span className='account-selection-note'>
                            Note: Index starts from 1, and the end index is inclusive.
                        </span>
                    ) : null

                }


            </div>
        </div>

    );
}

export default LeftPanel;
