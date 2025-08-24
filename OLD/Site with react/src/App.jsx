import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { httpsCallable } from 'firebase/functions';
import { analytics, functions } from './config/firebase';

import './App.css'
import HomePage from './Components/HomePage';
import TermsAndConditions from './Components/TermsAndConditions';
import PrivacyPolicy from './Components/PrivacyPolicy';
import Instructions from './Components/Instructions';
import Header from './Components/Header';
import Footer from './Components/Footer';


const App = () => {

    const visitCount = httpsCallable(functions, 'visit_count');

    useEffect(() => {
        logEvent(analytics, 'site_visit', {
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title
        })

        

        
    }, [])

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tc" element={<TermsAndConditions />} />
                <Route path="/pp" element={<PrivacyPolicy />} />
                <Route path="*" element={<HomePage />} />
                <Route path="/instructions" element={<Instructions />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}

export default App
