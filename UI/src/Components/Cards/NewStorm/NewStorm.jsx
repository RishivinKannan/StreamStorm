import { useContext, useState } from "react";
import { useColorScheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { CardHeader, CardContent, Divider } from "@mui/material";
import { Settings2 } from 'lucide-react';

import "./NewStorm.css";
import LeftPanel from "./Panels/Left/LeftPanel";
import RightPanel from "./Panels/Right/RightPanel";
import { CustomMUIPropsContext } from "../../../lib/ContextAPI";
import ManageProfilesModal from "../../Modals/ManageProfiles/ManageProfiles";


const NewStorm = () => {
    const { cardProps } = useContext(CustomMUIPropsContext);
    const { colorScheme } = useColorScheme();

    const [manageProfilesOpen, setManageProfilesOpen] = useState(true);

    return (
        <Card
            className={
                `new-storm-card  ${colorScheme}-bordered-container`
            }
            sx={cardProps}
        >
            <div className="card-header-container">
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