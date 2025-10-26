
import { useState, useEffect } from 'react';
import { useColorScheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

import { Tv } from 'lucide-react';

import { useCustomMUIProps } from '../../../../context/CustomMUIPropsContext';
import { useStormData } from '../../../../context/StormDataContext';

const CreateChannels = () => {
    const { colorScheme } = useColorScheme();
    const { btnProps, inputProps } = useCustomMUIProps();
    const formControls = useStormData();

    const [logoRequired, setLogoRequired] = useState(false);
    const [logoSelection, setLogoSelection] = useState('random');

    const [channels, setChannels] = useState([]);
    const [channelsString, setChannelsString] = useState('');
    const [channelsError, setChannelsError] = useState(false);
    const [channelsHelperText, setChannelsHelperText] = useState('');

    const [channelsLogoPath, setChannelsLogoPath] = useState('');
    const [channelsLogoPathError, setChannelsLogoPathError] = useState(false);
    const [channelsLogoPathHelperText, setChannelsLogoPathHelperText] = useState('');
    const [validatingPath, setValidatingPath] = useState(false);
    const [creatingChannels, setCreatingChannels] = useState(false);

    const [totalChannels, setTotalChannels] = useState({});

    const channelsChangeHandler = (value) => {
        setChannelsError(false);
        setChannelsHelperText('');
        setChannelsString(value);

        const channels = value.split('\n').map(channel => channel.trim()).filter(channel => channel !== '');
        setChannels(channels);
    };

    const onLogosPathChangeHandler = (value) => {
        setChannelsLogoPath(value);
        setChannelsLogoPathError(false);
        setChannelsLogoPathHelperText('');
    }

    const onValidatePathHandler = () => {
        if (!channelsLogoPath) {
            setChannelsLogoPathError(true);
            setChannelsLogoPathHelperText('Enter a system path');
        }

        setValidatingPath(true);

        fetch(`${formControls.hostAddress}/environment/channels/verify_dir`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ directory: channelsLogoPath }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setChannelsLogoPathError(false);
                    setChannelsLogoPathHelperText('');

                    setTotalChannels({ count: data.count, files: data.files });
                } else {
                    setChannelsLogoPathError(true);
                    setChannelsLogoPathHelperText(data.message);
                }

            })
            .finally(() => {
                setValidatingPath(false);
            });
    }

    const onStartHandler = () => {

    };

    // useEffect(() => {
    //     console.log(channels);
    // }, [channelsString]);

    return (
        <div className={`create-channels-container ${colorScheme}-text`}>
            <div className="section-header">
                <Tv className="section-logo" size={20} color={"var(--input-active-red-dark)"} />
                <h3 className={`section-title ${colorScheme}-text`}>Create Channels</h3>
            </div>
            <div className='create-channels-grid'>
                <div className={`logo-input-container ${logoRequired ? 'logo-required' : ''}`}>
                    <div className={`switch-container logo-switch-container ${colorScheme}-bordered-container`}>
                        <span className={`switch-label-${colorScheme}`}>Logo Required? </span>
                        <Switch
                            checked={logoRequired}
                            disabled={creatingChannels}
                            onChange={(e) => setLogoRequired(e.target.checked)}
                        />
                    </div>
                    {
                        logoRequired && (
                            <div className={`radio-container`}>
                                <RadioGroup
                                    row
                                    defaultValue="basic"
                                    name="channel-index-radio-group"
                                    onChange={(e) => setLogoSelection(e.target.value)}
                                    disabled={formControls.stormInProgress || formControls.loading}
                                >
                                    <div className="logo-radio-container">
                                        <div className="logo-radio">
                                            <Radio
                                                value="random"
                                                checked={logoSelection === "random"}
                                                disabled={creatingChannels}
                                            />
                                            <span className="channel-index-input-label">Random Logo</span>
                                        </div>
                                        <div className="logo-radio">
                                            <Radio
                                                value="custom"
                                                checked={logoSelection === "custom"}
                                                disabled={creatingChannels}
                                            />
                                            <span className="channel-index-input-label">Custom Logo</span>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        )
                    }

                </div>

                <div className='channel-data-input-container'>

                    {
                        logoRequired && logoSelection == "custom" ? (
                            <div className="channel-logo-path-container">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Channel logos path in PC"
                                    sx={{
                                        ...inputProps,
                                        marginTop: "1rem",
                                        '.MuiInputBase-root.MuiOutlinedInput-root': {
                                            paddingRight: ".4rem",
                                            backgroundColor: colorScheme === 'light' ? "var(--very-light-red)" : "var(--dark-gray)",
                                            borderRadius: "var(--border-radius)",
                                        }
                                    }}
                                    value={channelsLogoPath}
                                    onChange={e => onLogosPathChangeHandler(e.target.value)}
                                    error={channelsLogoPathError}
                                    helperText={channelsLogoPathHelperText}
                                    disabled={creatingChannels}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            ...btnProps,
                                                            marginTop: "0",
                                                            // height: "3.5rem",


                                                            backgroundColor: colorScheme === 'light' ? "var(--bright-red-2)" : "var(--input-active-red-dark)"
                                                        }}
                                                        disabled={creatingChannels || validatingPath}
                                                        onClick={onValidatePathHandler}
                                                    >
                                                        Validate
                                                    </Button>
                                                </InputAdornment>
                                            )
                                        }

                                    }}
                                />
                                {
                                    Object.keys(totalChannels).length !== 0 && (
                                        <div className="total-channels-container">
                                            <span className="total-channels-data">Total Channels Found: {totalChannels.count}</span>
                                        </div>
                                    )
                                }

                            </div>

                        ) : (
                            <TextField
                                multiline
                                fullWidth
                                rows={4}
                                variant="outlined"
                                label="Channel names"
                                sx={{
                                    ...inputProps,
                                    marginTop: "1rem"
                                }}
                                value={channelsString}
                                onChange={e => channelsChangeHandler(e.target.value)}
                                error={channelsError}
                                helperText={channelsHelperText}
                                disabled={creatingChannels}
                            />
                        )
                    }


                </div>
            </div>

            <Button
                variant="contained"
                sx={{
                    ...btnProps,
                    marginTop: "1rem",
                }}
                disabled={creatingChannels}
            >
                Start
            </Button>

        </div>
    );
};

export default CreateChannels;
