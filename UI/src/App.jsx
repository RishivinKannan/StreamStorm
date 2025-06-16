import { useEffect } from "react";
import { useColorScheme } from '@mui/material/styles';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';

import "./App.css";
import Header from "./Components/Sections/Header/Header";
import Footer from "./Components/Sections/Footer/Footer";
import Main from "./Components/Sections/Main/Main";
import AppProviders from "./lib/AppProviders";


const App = () => {

    const { colorScheme, setColorScheme } = useColorScheme();
    const [defaultColorScheme] = useLocalStorageState('theme', 'light');

    useEffect(() => {
        setColorScheme(defaultColorScheme);
    }, [setColorScheme, defaultColorScheme]);


    return (
        <AppProviders theme={colorScheme}>
            <div className={`main-container main-container-${colorScheme}`}>
                <Header />
                <Main />
                <Footer />
            </div>
        </AppProviders>
    )
}

export default App;