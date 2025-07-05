import Disclaimer from './Disclaimer.jsx';
import Features from './Features.jsx';
import OverView from './OverView.jsx';

const MainContent = () => {
    return (
        <div className="main-content-container">
            <OverView />
            <Features />
            <Disclaimer />
        </div>
    );
};

export default MainContent;