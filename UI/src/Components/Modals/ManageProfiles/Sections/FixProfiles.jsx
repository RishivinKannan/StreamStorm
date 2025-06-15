import { useContext, useState } from 'react';
import { Wrench } from 'lucide-react';
import { Button, MenuItem, TextField, useColorScheme } from '@mui/material';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { useNotifications } from '@toolpad/core/useNotifications';
import { RefreshCw } from 'lucide-react';

import "./Sections.css";
import { BROWSERS } from '../../../../lib/Constants';
import { customMUIPropsContext } from '../../../../lib/ContextAPI';
import ErrorText from '../../../ErrorText';

const FixProfiles = ({ currentBrowser }) => {

    const { colorScheme } = useColorScheme();
    const { btnProps, inputProps } = useContext(customMUIPropsContext);
    const [hostAddress] = useLocalStorageState("hostAddress");
    const notifications = useNotifications();

    const [browser, setBrowser] = useState("");
    const [browserError, setBrowserError] = useState(false);
    const [browserHelperText, setBrowserHelperText] = useState("");

    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFixProfiles = () => {

        setErrorText("");

        if (!browser) {
            setBrowserError(true);
            setBrowserHelperText("Select a browser");
            return;
        } else {
            setBrowserError(false);
            setBrowserHelperText("");
        }

        setLoading(true);

        fetch(`${hostAddress}/fix_profiles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ browser }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    notifications.show("Profiles fixed successfully!", {
                        severity: "success",
                    });
                } else {
                    setErrorText(data.message || "Failed to fix profiles");
                    notifications.show("Failed to fix profiles", {
                        severity: 'error',
                    });
                }
            })
            .catch((error) => {
                console.error("Error fixing profiles:", error);
                setErrorText("An error occurred while fixing profiles");
                notifications.show("An error occurred while fixing profiles", {
                    severity: 'error',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }


    return (
        <div className="fix-profiles-container">
            <div className="section-header">
                <Wrench className="section-logo" size={20} color={"var(--input-active-red-dark)"} />
                <h3 className={`section-title ${colorScheme}-text`}>Fix Profiles</h3>
            </div>

            <div className="section-content">
                <TextField
                    fullWidth
                    select
                    label="Browser"
                    variant="outlined"
                    value={browser}
                    onChange={(e) => {
                        setBrowser(e.target.value);
                        setBrowserError(false);
                        setBrowserHelperText("");
                        setErrorText("");
                    }}
                    error={browserError}
                    helperText={browserHelperText}
                    disabled={loading}
                    sx={{
                        ...inputProps,
                        marginTop: "1rem",
                    }}
                >
                    {
                        BROWSERS.map((browser) => {
                            let browserText = browser.toLowerCase();
                            return (
                                <MenuItem key={browser} value={browserText} disabled={browserText === currentBrowser}>
                                    {browser} {browserText === currentBrowser ? "(Current browser)" : ""}
                                </MenuItem>
                            )
                        })
                    }
                </TextField>
            </div>

            <div className="section-action">
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                        ...btnProps,
                        marginTop: "1rem",
                        borderColor: colorScheme === 'light' ? "var(--bright-red)" : "#ea6161",
                        color: colorScheme === 'light' ? "#e84a4a" : "#ea6161",
                        '&:hover': {
                            backgroundColor: "var(--bright-red)",
                            color: colorScheme === 'light' ? "var(--very-light-red)" : "var(--dark-gray)"
                        }
                    }}
                    onClick={handleFixProfiles}
                    disabled={loading}
                >
                    {
                        loading ? (
                            <>
                                <RefreshCw size={20} className="spin" />
                                &nbsp;&nbsp;Fixing Profiles...
                            </>
                        ) : "Fix Profiles"
                    }
                </Button>

            </div>

            <ErrorText errorText={errorText} />
        </div>
    );
};

export default FixProfiles;