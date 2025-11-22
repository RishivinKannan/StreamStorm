import { useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useSocket } from './context/Socket';

import "./App.css";
import Header from "./Components/Sections/Header/Header";
import Footer from "./Components/Sections/Footer/Footer";
import Main from "./Components/Sections/Main/Main";

const App = () => {

    const { colorScheme } = useColorScheme();
    const {socket, socketConnected} = useSocket();

    useEffect(() => {
        if (!socket || !socket.connected || !socketConnected) return;
        
        socket.on("log", (data) => {
            console.log("Log message from server:", data);
        });
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