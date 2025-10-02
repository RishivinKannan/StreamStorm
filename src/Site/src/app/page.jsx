import OverView from '../components/OverView';
import Features from '../components/Features';
import Disclaimer from '../components/Disclaimer';

const HomePage = () => {
    return (        
        <main className="main-content-container">
            <OverView />
            <Features />
            <Disclaimer />    
        </main>
    );
};

export default HomePage;