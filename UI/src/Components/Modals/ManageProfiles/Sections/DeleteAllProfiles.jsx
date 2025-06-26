import { useContext, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, MenuItem, TextField, useColorScheme } from '@mui/material';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { useNotifications } from '@toolpad/core/useNotifications';
import { RefreshCw } from 'lucide-react';

import "./Sections.css";
import { BROWSER_CLASSES, BROWSERS } from '../../../../lib/Constants';
import { CustomMUIPropsContext } from '../../../../lib/ContextAPI';
import ErrorText from '../../../Elements/ErrorText';

const DeleteAllProfiles = () => {

    const { colorScheme } = useColorScheme();
    const { btnProps, inputProps } = useContext(CustomMUIPropsContext);

    const [hostAddress] = useLocalStorageState("hostAddress");
    const notifications = useNotifications();

    const [browserClass, setBrowserClass] = useState("");
    const [browserError, setBrowserError] = useState(false);
    const [browserHelperText, setBrowserHelperText] = useState("");

    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeleteAllProfiles = () => {
        setErrorText("");
        if (!browserClass) {
            setBrowserError(true);
            setBrowserHelperText("Select a browserClass");
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
            body: JSON.stringify({ browser_class: browserClass }),
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
                    label="Browser Class"
                    variant="outlined"
                    sx={{
                        ...inputProps,
                        marginTop: "1rem",
                    }}
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
                        backgroundColor: colorScheme === 'light' ? "var(--bright-red-2)" : "var(--input-active-red-dark)",
                        color: "var(--light-text)",
                    }}
                    onClick={handleDeleteAllProfiles}
                    disabled={loading}
                    startIcon={loading ? <RefreshCw size={20} className="spin" /> : <Trash2 size={20} />}

                >
                    {
                        loading ? "Deleting Profiles..." : "Delete Profiles"
                    }
                </Button>

            </div>
            <ErrorText errorText={errorText} />
        </div>
    );
};

export default DeleteAllProfiles;