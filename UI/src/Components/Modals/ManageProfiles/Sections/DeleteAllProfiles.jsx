import { useContext, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, useColorScheme } from '@mui/material';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { useNotifications } from '@toolpad/core/useNotifications';
import { RefreshCw } from 'lucide-react';
import { useDialogs } from '@toolpad/core/useDialogs';

import "./Sections.css";
import { CustomMUIPropsContext } from '../../../../lib/ContextAPI';
import ErrorText from '../../../Elements/ErrorText';
import AreYouSure from '../../../Dialogs/AreYouSure';

const DeleteAllProfiles = () => {

    const { colorScheme } = useColorScheme();
    const { btnProps } = useContext(CustomMUIPropsContext);
    const dialogs = useDialogs();

    const [hostAddress] = useLocalStorageState("hostAddress");
    const notifications = useNotifications();

    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeleteAllProfiles = async () => {
        
        const confirmed = await dialogs.open(AreYouSure, {
            text: <span>Are you sure you want to <strong style={{ color: "var(--input-active-red-dark)" }}>DELETE</strong> all profiles</span>
        });
        
        if(!confirmed) {
            return
        }
        
        setErrorText("");
        setLoading(true);

        fetch(`${hostAddress}/delete_all_profiles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
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
                        loading ? "Deleting Profiles..." : "Delete All Profiles"
                    }
                </Button>

            </div>
            <ErrorText errorText={errorText} />
        </div>
    );
};

export default DeleteAllProfiles;