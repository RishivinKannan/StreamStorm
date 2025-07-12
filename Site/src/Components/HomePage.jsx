import OverView from './OverView';
import Features from './Features';
import Disclaimer from './Disclaimer';

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