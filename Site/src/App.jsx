import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import HomePage from './Components/HomePage';
import TermsAndConditions from './Components/TermsAndConditions';
import PrivacyPolicy from './Components/PrivacyPolicy';
import Instructions from './Components/Instructions';


const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tc" element={<TermsAndConditions />} />
                <Route path="/pp" element={<PrivacyPolicy />} />
                <Route path="*" element={<HomePage />} />
                <Route path="/instructions" element={<Instructions />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
