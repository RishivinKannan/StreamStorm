import { useState, useEffect } from "react"

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Switch } from "@mui/material";

import getBrowser from "./scripts/getBrowser.js";
import submit from "./scripts/submit.ts";
import './Input.css'

const Input = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [messagesString, setMessagesString] = useState('');
    const [messages, setMessages] = useState([]);
    const [subscribe, setSubscribe] = useState(false);
    const [subscribeAndWait, setSubscribeAndWait] = useState(false);
    const [subscribeWaitTime, setSubscribeWaitTime] = useState(0);
    const [slowMode, setSlowMode] = useState(5);
    const [startAccountIndex, setStartAccountIndex] = useState(1);
    const [endAccountIndex, setEndAccountIndex] = useState(0);
    const [noOfAccounts, setNoOfAccounts] = useState(1);
    const [browser, setBrowser] = useState('');
    const [loadInBackground, setLoadInBackground] = useState(false);

    const [accountSelection, setAccountSelection] = useState('basic');
    const [currentBrowser, setCurrentBrowser] = useState('');


    const messagesChangeHandler = (e) => {
        const value = e.target.value;
        setMessagesString(value);

        const allMessages = value.split('\n').filter((message) => {
            // console.log("Message: ", message);
            return message !== '';
        });

        // console.log(value);
        // console.log(allMessages);

        setMessages(allMessages);
    }

    useEffect(() => {
        getBrowser(setCurrentBrowser, setBrowser);
    }, [])


    const onStartHandler = () => { 
        submit()
    }



    return (
        <div className="input-container">
            <div className="input-heading-container">
                <span className='input-heading-text'>New Storm</span>
            </div>

            <div className="input-form-container">
                <TextField
                    label="Video URL"
                    variant="outlined"
                    size='small'
                    margin='normal'
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />

                <TextField
                    id="outlined-multiline-static"
                    label="Messages"
                    variant="outlined"
                    size='small'
                    margin='normal'
                    multiline
                    // rows={4}
                    minRows={5}
                    maxRows={10}
                    value={messagesString}
                    onChange={messagesChangeHandler}
                />

                <div className="switch-container">
                    <Switch
                        checked={subscribe}
                        onChange={(e) => setSubscribe(e.target.checked)}
                        color="primary"
                    />
                    <span>Subscribe</span>
                </div>

                <div className="switch-container">
                    <Switch
                        checked={subscribeAndWait}
                        onChange={(e) => {
                            setSubscribeAndWait(e.target.checked);

                            if (e.target.checked) {
                                setSubscribe(true);
                            }
                        }}
                        color="primary"
                    />
                    <span>Subscribe and Wait</span>
                </div>

                {
                    subscribeAndWait &&
                    <TextField
                        label="Subscribe Wait Time"
                        variant="outlined"
                        size='small'
                        margin='normal'
                        value={subscribeWaitTime}
                        onChange={(e) => setSubscribeWaitTime(e.target.value)}
                    />
                }

                <TextField
                    label="Slow Mode"
                    variant="outlined"
                    size='small'
                    margin='normal'
                    value={slowMode}
                    onChange={(e) => setSlowMode(e.target.value)}
                />

                <div className="account-selection-container">
                    <span> Account Selection: </span>
                    <RadioGroup
                        row
                        value={accountSelection}
                        onChange={(e) => setAccountSelection(e.target.value)}
                    >
                        <div className="radio-container">
                            <Radio value="basic" />
                            <span>Basic</span>

                        </div>
                        <div className="radio-container">
                            <Radio value="advanced" />
                            <span>Advanced</span>
                        </div>
                    </RadioGroup>

                </div>

                {
                    accountSelection === 'basic' &&
                    <TextField
                        label="No of Accounts"
                        variant="outlined"
                        size='small'
                        margin='normal'
                        value={noOfAccounts}
                        onChange={(e) => setNoOfAccounts(e.target.value)}
                    />
                }

                {
                    accountSelection === 'advanced' &&
                    <div className="account-selection-advanced-container">
                        <TextField
                            label="Start Account Index (Starting with 1)"
                            variant="outlined"
                            size='small'
                            margin='normal'
                            value={startAccountIndex}
                            onChange={(e) => setStartAccountIndex(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="End Account Index"
                            variant="outlined"
                            size='small'
                            margin='normal'
                            value={endAccountIndex}
                            onChange={(e) => setEndAccountIndex(e.target.value)}
                            fullWidth
                        />
                    </div>
                }

                <TextField
                    select
                    label="Browser"
                    value={browser}
                    onChange={(e) => {
                        setBrowser(e.target.value)
                        console.log(e.target.value);
                    }}
                    variant="outlined"
                    size='small'
                    margin='normal'
                >
                    <MenuItem
                        value='chrome'
                        disabled={currentBrowser === 'chrome'}
                    >
                        {
                            currentBrowser === 'chrome' ? 'Chrome (Cannot use current browser)' : 'Chrome'
                        }
                    </MenuItem>
                    <MenuItem
                        value='edge'
                        disabled={currentBrowser === 'edge'}
                    >
                        {
                            currentBrowser === 'edge' ? 'Edge (Cannot use current browser)' : 'Edge'
                        }
                    </MenuItem>


                </TextField>

                <div className="switch-container">
                    <Switch
                        checked={loadInBackground}
                        onChange={(e) => setLoadInBackground(e.target.checked)}
                        color="primary"
                    />
                    <span>Load in Background</span>
                </div>

                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    color='error'
                    fullWidth
                >
                    Start Storm
                </Button>







            </div>


        </div>
    )
}

export default Input;