import { useContext, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, MenuItem, TextField, useColorScheme } from '@mui/material';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { useNotifications } from '@toolpad/core/useNotifications';
import { RefreshCw } from 'lucide-react';

import "./Sections.css";
import { BROWSERS } from '../../../../lib/Constants';
import { customMUIProps } from '../../../../lib/ContextAPI';
import ErrorText from '../../../ErrorText';

const DeleteAllProfiles = ({ currentBrowser }) => {

    const { colorScheme } = useColorScheme();
    const { btnProps, inputProps } = useContext(customMUIProps);

    const [hostAddress] = useLocalStorageState("hostAddress");
    const notifications = useNotifications();

    const [browser, setBrowser] = useState("");
    const [browserError, setBrowserError] = useState(false);
    const [browserHelperText, setBrowserHelperText] = useState("");

    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeleteAllProfiles = () => {
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

        fetch(`${hostAddress}/delete_all_profiles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ browser }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    notifications.show("All profiles deleted successfully!", {
                        severity: "success",
                    });
                } else {
                    setErrorText(data.message || "Failed to delete all profiles");
                    notifications.show("Failed to delete all profiles", {
                        severity: 'error',
                    });
                }
            })
            .catch((error) => {
                setErrorText(error.message || "An error occurred while deleting all profiles");
                notifications.show("An error occurred while deleting all profiles", {
                    severity: 'error',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <div className="fix-profiles-container">
            <div className="section-header">
                <Trash2 className="section-logo" size={20} color={"var(--input-active-red-dark)"} />
                <h3 className={`section-title ${colorScheme}-text`}>Delete All Profiles</h3>
            </div>

            <div className="section-content">
                <TextField
                    fullWidth
                    select
                    label="Browser"
                    variant="outlined"
                    sx={{
                        ...inputProps,
                        marginTop: "1rem",
                    }}
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
                        backgroundColor: colorScheme === 'light' ? "var(--bright-red-2)" : "var(--dark-red-2)",
                        color: "var(--light-text)",
                        "&:hover": {
                            backgroundColor: colorScheme === 'light' ? "var(--bright-red-2-hover)" : "var(--dark-red-2-hover)",
                            color: "var(--light-text)",
                        },
                    }}
                    onClick={handleDeleteAllProfiles}
                    disabled={loading}

                >
                    {
                        loading ? (
                            <>
                                <RefreshCw size={20} className="spin" />
                                &nbsp;&nbsp;Deleting Profiles...
                            </>
                        ) : "Delete Profiles"
                    }
                </Button>

            </div>
            <ErrorText errorText={errorText} />
        </div>
    );
};

export default DeleteAllProfiles;