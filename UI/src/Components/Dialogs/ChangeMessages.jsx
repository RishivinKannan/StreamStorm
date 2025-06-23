import { useContext, useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useColorScheme } from "@mui/material";

import { CustomMUIPropsContext, StormDataContext } from "../../lib/ContextAPI";

const ChangeMessages = ({ payload, open, onClose }) => {
    const { btnProps, inputProps } = useContext(CustomMUIPropsContext);
    const { formControls } = payload;
    const { colorScheme } = useColorScheme();

    const [messagesString, setMessagesString] = useState("");

    useEffect(() => {
        setMessagesString(formControls.messagesString);
    }, [formControls.messagesString]);

    const [messages, setMessages] = useState([]);
    const [messagesError, setMessagesError] = useState(false);
    const [messagesHelperText, setMessagesHelperText] = useState("");

    const messagesChangeHandler = (e) => {
        const value = e.target.value;
        setMessagesString(value);

        const allMessages = value.split('\n').filter((message) => {
            return message !== '';
        });

        allMessages = allMessages.map((message) => message.trim())

        setMessages(allMessages);
        setMessagesError(false);
        setMessagesHelperText("");
    }

    const onSubmitHandler = () => {
        if (messages.length === 0) {
            setMessagesError(true);
            setMessagesHelperText("Please enter at least one message.");
            return;
        }

        if (JSON.stringify(messages) === JSON.stringify(formControls.messages)) {
            setMessagesError(true);
            setMessagesHelperText("No changes made to the messages.");
            return;
        }

        formControls.setMessages(messages);
        onClose(messages);
    }

    return (
        <Dialog
            open={open}
            fullWidth
            onClose={() => onClose(null)}
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: colorScheme === 'light' ? "var(--white)" : "var(--light-gray)",
                    backgroundImage: "none",
                    borderRadius: "var(--border-radius)",
                },
            }}
        >
            <DialogTitle>
                Change Messages
            </DialogTitle>
            <DialogContent>
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Messages"
                    fullWidth
                    value={messagesString}
                    onChange={messagesChangeHandler}
                    error={messagesError}
                    helperText={messagesHelperText}
                    sx={ inputProps }
                />

            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={() => onClose(false)}
                    sx={{
                        ...btnProps,
                        width: "100px",
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="outlined"
                    onClick={onSubmitHandler}
                    sx={{
                        ...btnProps,
                        width: "100px",
                        backgroundColor: "var(--input-active-red-dark)",
                        '&:hover': {
                            backgroundColor: colorScheme === 'light' ? "var(--input-active-red-light-hover)" : "var(--input-active-red-dark-hover)",
                        },
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangeMessages;