import { useDownloadCount } from "@/context/DownloadCountContext";
import { useState } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/config/firebase";

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='linux-code-block-container'>
            <code className='linux-code-block'>{code}</code>
            <button className='linux-copy-button' onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy'}
            </button>
        </div>
    );
};

const Linux = () => {

    const [downloadButtonDisabled, setDownloadButtonDisabled] = useState(false);

    const { downloadCount, updateDownloadCount } = useDownloadCount();

    const handleDownload = () => {
        setDownloadButtonDisabled(true);
        logEvent(analytics, 'download_count');
        updateDownloadCount();

        setTimeout(() => {
            setDownloadButtonDisabled(false);
        }, 5000); // Reset button after 5 seconds
    }

    return (
        <section className='download-section'>
            <div className='download-section-title-container'>
                <h4 className='download-section-title'>Download for Linux</h4>
            </div>
            <span className="download-note">
                <i>For Linux distributions with glibc 2.29+</i>
            </span>

            {/* Tar.gz Installation */}
            <div className='linux-install-method'>
                <h5 className='linux-method-title'>📦 Option 1: tar.gz Package</h5>
                <ol className='linux-install-list'>
                    <li>
                        <span className='linux-step-label'>Download the package:</span>
                        <CodeBlock code="wget https://github.com/Ashif4354/StreamStorm/releases/latest/download/StreamStorm.tar.gz" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Extract the archive:</span>
                        <CodeBlock code="tar -xzf StreamStorm.tar.gz" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Create a symbolic link:</span>
                        <CodeBlock code="sudo ln -s ./StreamStorm/streamstorm /usr/local/bin/streamstorm" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Navigate to the directory:</span>
                        <CodeBlock code="cd StreamStorm" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Make the script executable:</span>
                        <CodeBlock code="chmod +x streamstorm" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Run StreamStorm:</span>
                        <CodeBlock code="./streamstorm" />
                    </li>
                </ol>
            </div>

            {/* Debian Installation */}
            <div className='linux-install-method'>
                <h5 className='linux-method-title'>🐧 Option 2: Debian Package (Ubuntu/Debian)</h5>
                <ol className='linux-install-list'>
                    <li>
                        <span className='linux-step-label'>Download the .deb file:</span>
                        <CodeBlock code="wget https://github.com/Ashif4354/StreamStorm/releases/latest/download/StreamStorm.deb" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Install the package:</span>
                        <CodeBlock code="sudo dpkg -i StreamStorm.deb" />
                    </li>
                    <li>
                        <span className='linux-step-label'>Run StreamStorm:</span>
                        <CodeBlock code="streamstorm" />
                    </li>
                </ol>
            </div>

            {
                downloadCount && (
                    <span className="download-note">
                        <i>Total Downloads: {downloadCount}</i>
                    </span>
                )
            }
        </section>
    )
};

export default Linux
