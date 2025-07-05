import LaunchIcon from '@mui/icons-material/Launch';
import ss from "../../assets/ss.png"

const OverView = () => {
    return (
        <section id="overview" className="overview">
            <div className="overview-inner-container">
                <h2 className="tag-line">Unleash Chaos in <span className="red-text">YouTube Live Chats</span></h2>
                <span className="overview-description">
                    A desktop application to automate mass messaging. 
                    Storm chats in YouTube Live Streams at full throttle. 
                    No coding required. Just Pure, unadulterated disruptions
                </span>
                <div className="overview-buttons-container">
                    <a href="https://github.com/Ashif4354/StreamStorm/releases/latest/download/StreamStorm.Setup.exe" download>
                        <button className="overview-download-button">
                            Download Now
                        </button>
                    </a>

                    <button className="overview-github-button" onClick={() => window.open('https://github.com/Ashif4354/StreamStorm', '_blank')}>
                        View on GitHub &nbsp;&nbsp;<LaunchIcon />
                    </button>
                </div>

                <div className="overview-image-container">
                    <img src={ss} alt="StreamStorm Overview" className="overview-media" />
                </div>
            </div>
        </section>
    );
};

export default OverView;
