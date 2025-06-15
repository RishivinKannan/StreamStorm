import { useContext } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { MenuItem, TextField, Switch, Button, Divider } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Users } from 'lucide-react';

import "./RightPanel.css";
import StormControls from './StormControls/StormControls';
import { currentBrowserContext, customMUIPropsContext } from '../../../../../lib/ContextAPI';
import { BROWSERS } from '../../../../../lib/Constants';

const RightPanel = (props) => {

    const { setManageProfilesOpen } = props;

    const { btnProps, inputProps } = useContext(customMUIPropsContext);
    const { colorScheme } = useColorScheme();
    const currentBrowser = useContext(currentBrowserContext);

    return (
        <div className="right-panel-container">
            <TextField
                select
                variant="outlined"
                label="Select Browser"
                sx={inputProps}
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

            <div className="switches-container">
                <div className={`switch-container ${colorScheme}-bordered-container`}>
                    <span className="switch-label">Load in background</span>
                    <Switch
                        color="primary"
                    />
                </div>
            </div>

            <Button
                variant="contained"
                color="primary"
                className={`start-storm-button ${colorScheme}-bordered-container`}
                startIcon={<PlayArrowIcon />}
                sx={{
                    ...btnProps,
                    marginTop: "16px",
                    backgroundColor: colorScheme === 'light' ? "var(--input-active-red-light)" : "var(--input-active-red-dark)",
                    borderRadius: "var(--border-radius)",
                    border: "none",
                    '&:hover': {
                        backgroundColor: colorScheme === 'light' ? "var(--input-active-red-light-hover)" : "var(--input-active-red-dark-hover)",
                    },
                    height: "40px",
                    color: "var(--light-text)",
                }}
            >
                Start Storm
            </Button>

            <Divider
                sx={{
                    margin: "calc(16px - 0.5rem) 0",
                }}
            />

            <StormControls />

            <Divider
                sx={{
                    margin: "calc(16px - 0.5rem) 0",
                }}
            />

            <Button
                startIcon={<Users size="1rem" />}
                sx={btnProps}
                onClick={() => setManageProfilesOpen(true)}
            >
                Manage Profiles
            </Button>


        </div>
    );
}

export default RightPanel;
