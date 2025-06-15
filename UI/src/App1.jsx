import { useEffect, useState } from 'react';
import './App.css';

import TornadoIcon from '@mui/icons-material/Tornado';
import Input from './Components/Input/Input';
import { useColorScheme } from '@mui/material/styles';

const App = () => {

    const [videoUrl, setVideoUrl] = useState('');
    const [chatUrl, setChatUrl] = useState('');
    const [messages, setMessages] = useState(['']);
    const [subscribe, setSubscribe] = useState(false);
    const [subscribeAndWait, setSubscribeAndWait] = useState(false);
    const [subscribeWaitTime, setSubscribeWaitTime] = useState(0);
    const [slowMode, setSlowMode] = useState(0);
    const [startAccountIndex, setStartAccountIndex] = useState(0);
    const [endAccountIndex, setEndAccountIndex] = useState(0);
    const [browser, setBrowser] = useState('Chrome');
    const [loadInBackground, setLoadInBackground] = useState(false);

    const {colorScheme, setColorScheme } = useColorScheme();
    useEffect(() => {
        setColorScheme('system'); // Set default color scheme
    }, [setColorScheme]);




    return (
        <div className="main-container">
            <header className="header">
                <h1><TornadoIcon/> StreamStorm</h1>
            </header>

            <main className="streamstorm-main">

                <Input/>
                
            </main>

            {/* <footer className="footer">
                <span className='footer-text'>&copy; 2024 StreamStorm. All rights reserved.</span>
            </footer> */}
        </div>
    );
}

export default App;
