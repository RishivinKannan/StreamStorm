import { useContext, useState } from 'react';
import { Wrench } from 'lucide-react';
import { Button, MenuItem, TextField, useColorScheme } from '@mui/material';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { useNotifications } from '@toolpad/core/useNotifications';
import { RefreshCw } from 'lucide-react';

import "./Sections.css";
import { BROWSER_CLASSES, BROWSERS } from '../../../../lib/Constants';
import { CustomMUIPropsContext } from '../../../../lib/ContextAPI';
import ErrorText from '../../../Elements/ErrorText';

const FixProfiles = ({ currentBrowser }) => {

    const { colorScheme } = useColorScheme();
    const { btnProps, inputProps } = useContext(CustomMUIPropsContext);
    const [hostAddress] = useLocalStorageState("hostAddress");
    const notifications = useNotifications();

    const [browserClass, setBrowserClass] = useState("");
    const [browserError, setBrowserError] = useState(false);
    const [browserHelperText, setBrowserHelperText] = useState("");

    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFixProfiles = () => {

        setErrorText("");

        if (!browserClass) {
            setBrowserError(true);
            setBrowserHelperText("Select a browser class");
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
            body: JSON.stringify({ browser_class: browserClass }),
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
                    label="Browser Class"
                    variant="outlined"
                    value={browserClass}
                    onChange={(e) => {
                        setBrowserClass(e.target.value);
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
                        BROWSER_CLASSES.map((className) => {
                            let MenuItemText, MenuItemDisabled;

                            if (className === "chromium") {
                                MenuItemText = "Chromium (Chrome, Edge, etc.)";
                            } else if (className === "gecko") {
                                MenuItemText = "Gecko (Firefox)";
                                MenuItemDisabled = true
                            } else if (className === "webkit") {
                                MenuItemText = "WebKit (Safari)";
                                MenuItemDisabled = true;
                            }

                            return (
                                <MenuItem key={className} value={className} disabled={MenuItemDisabled}>
                                    {MenuItemText} {MenuItemDisabled ? "(Not supported yet)" : ""}
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