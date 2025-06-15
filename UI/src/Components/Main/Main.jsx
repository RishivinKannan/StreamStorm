import { useColorScheme } from '@mui/material/styles';

import "./Main.css";
import HostConfig from "../Cards/HostConfig/HostConfig";
import NewStorm from "../Cards/NewStorm/NewStorm";
import SystemInfo from "../Cards/SystemInfo/SystemInfo";


const Main = () => {
    const { colorScheme } = useColorScheme();

    return (
        <main className={`main main-${colorScheme}`}>
            <NewStorm />
            <div className="left-cards-container">
                <SystemInfo />
                <HostConfig />
            </div>
        </main>
    )
}

export default Main;