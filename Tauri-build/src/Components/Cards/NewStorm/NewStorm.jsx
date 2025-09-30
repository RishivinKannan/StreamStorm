import { useEffect, useState } from "react";
import { useColorScheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { CardHeader, CardContent, Divider } from "@mui/material";
import { Settings2 } from 'lucide-react';
import { logEvent } from "firebase/analytics";

import "./NewStorm.css";
import LeftPanel from "./Panels/Left/LeftPanel";
import RightPanel from "./Panels/Right/RightPanel";
import ManageProfilesModal from "../../Modals/ManageProfiles/ManageProfiles";
import fetchStatus from "../../../lib/FetchStatus";
import { useStormData } from "../../../context/StormDataContext";
import { analytics } from "../../../config/firebase";
import { useCustomMUIProps } from "../../../context/CustomMUIPropsContext";
import { useSystemInfo } from "../../../context/SystemInfoContext";

const NewStorm = () => {
    const { cardProps } = useCustomMUIProps();
    const { colorScheme } = useColorScheme();
    const [manageProfilesOpen, setManageProfilesOpen] = useState(false);
    const formControls = useStormData();
    const systemInfoControls = useSystemInfo();

    // setInterval(() => {
    //     const interval = fetchStatus(formControls);
    //     return () => clearInterval(interval);
    // }, 2000);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchStatus(formControls);
        }, 2000);

        systemInfoControls.setPollingIntervals(prev => [...prev, interval]);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(manageProfilesOpen) {
            logEvent(analytics, "manage_profiles_open");
        }
    }, [manageProfilesOpen]);

    return (
        <Card
            className={
                `new-storm-card  ${colorScheme}-bordered-container`
            }
            sx={cardProps}
        >
            <div className="card-header-container" id="new-storm">
                <CardHeader
                    avatar={<Settings2 />}
                    title="New Storm"
                    className={`card-header card-header-${colorScheme}`}
                    sx={{
                        padding: 0
                    }}
                />
                <span className={`card-header-description card-header-description-${colorScheme}`}>
                    Set up parameters for your new storm and manage active storm.
                </span>
            </div>
            <CardContent
                sx={{
                    padding: 0,
                }}
            >
                <div className="new-storm-card-content">
                    <LeftPanel />
                    <Divider orientation="vertical" />
                    <RightPanel setManageProfilesOpen={setManageProfilesOpen} />
                </div>
            </CardContent>

            <ManageProfilesModal open={manageProfilesOpen} setOpen={setManageProfilesOpen} />
        </Card>
    );
}

export default NewStorm;