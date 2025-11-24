import { useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useSocket } from './context/SocketContext';
import { useAppState } from './context/AppStateContext';

import "./App.css";
import Header from "./Components/Sections/Header/Header";
import Footer from "./Components/Sections/Footer/Footer";
import Main from "./Components/Sections/Main/Main";
import { MAX_LOGS } from './lib/Constants';

const App = () => {

    const { colorScheme } = useColorScheme();
    const {socket, socketConnected} = useSocket();
    const { setLogs } = useAppState();

    useEffect(() => {
        if (!socket || !socket.connected || !socketConnected) return;
        
        socket.on("log", (data) => {
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, data];
                if (newLogs.length > MAX_LOGS) {
                    newLogs.shift();
                }
                return newLogs;
            });
        });

        return () => {
            socket.off("log");
        };
    }, [socket, socketConnected]);

    return (
        <div className={`main-container main-container-${colorScheme}`}>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default App;