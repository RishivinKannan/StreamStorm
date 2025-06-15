import { useContext } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useColorScheme } from "@mui/material";

import "./AreYouSure.css";
import { customMUIProps } from "../../../lib/ContextAPI";

const AreYouSure = ({ payload, open, onClose }) => {
    const { btnProps } = useContext(customMUIProps);
    const { colorScheme } = useColorScheme();
    return (
        <Dialog
            open={open}
            fullWidth
            onClose={() => onClose(null)}
            className="are-you-sure-dialog"
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: colorScheme === 'light' ? "var(--white)" : "var(--light-gray)",
                    backgroundImage: "none",
                    borderRadius: "var(--border-radius)",
                },
            }}
        >
            <DialogTitle className="are-you-sure-dialog-title">
                Confirm
            </DialogTitle>
            <DialogContent className="are-you-sure-dialog-content">
                <DialogContentText className="are-you-sure-dialog-text">
                    {payload.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="are-you-sure-dialog-actions">
                <Button
                    variant="outlined"
                    onClick={() => onClose(false)}
                    className="are-you-sure-dialog-button"
                    color="primary"
                    sx={{
                        ...btnProps,
                        width: "100px",
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => onClose(true)}
                    className="are-you-sure-dialog-button"
                    color="error"
                    sx={{
                        ...btnProps,
                        width: "100px",
                        backgroundColor: "var(--input-active-red-dark)",
                        '&:hover': {
                            backgroundColor: colorScheme === 'light' ? "var(--input-active-red-light-hover)" : "var(--input-active-red-dark-hover)",
                        },
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AreYouSure;
