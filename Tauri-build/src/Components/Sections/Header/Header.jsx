import { useState, useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Tornado } from 'lucide-react';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { logEvent } from 'firebase/analytics';

import TornadoDark from '../../../assets/tornado.png';
import { analytics } from '../../../config/firebase';

import './Header.css';

const Header = () => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [defaultColorScheme, setDefaultColorScheme] =
        useLocalStorageState('theme');

    const switchTheme = () => {
        const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newColorScheme);
        setDefaultColorScheme(newColorScheme);
        logEvent(analytics, 'theme_switch', { theme: newColorScheme });
    };

    return (
        <header className={`header header-${colorScheme}`}>
            {colorScheme === 'light' ? (
                <Tornado className="header-logo" color="white" />
            ) : (
                <img
                    src={TornadoDark}
                    alt="StreamStorm Logo"
                    className="header-logo"
                />
            )}
            <h1>StreamStorm</h1>

            <div className="theme-toggle">
                <IconButton
                    className={`theme-toggle-button ${colorScheme}`}
                    onClick={switchTheme}
                >
                    {colorScheme === 'light' ? (
                        <DarkModeIcon sx={{ color: 'white' }} />
                    ) : (
                        <LightModeIcon />
                    )}
                </IconButton>
            </div>
        </header>
    );
};

export default Header;
