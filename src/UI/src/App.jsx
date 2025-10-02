import { useColorScheme } from '@mui/material/styles';

import "./App.css";
import Header from "./Components/Sections/Header/Header";
import Footer from "./Components/Sections/Footer/Footer";
import Main from "./Components/Sections/Main/Main";

const App = () => {

    const { colorScheme } = useColorScheme();

    return (
        <div className={`main-container main-container-${colorScheme}`}>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default App;