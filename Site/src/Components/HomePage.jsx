import Header from './Header';
import MainContent from './MainContent/MainContent';
import Footer from './Footer';

const HomePage = () => {
    return (
        <main className="main-container">
            <Header />   
            <MainContent />      
            <Footer />            
        </main>
    );
};

export default HomePage;