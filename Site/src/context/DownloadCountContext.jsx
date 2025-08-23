import { createContext, useContext, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';


const DownloadCountContext = createContext();

const DownloadCountProvider = ({ children }) => {
    const [downloadCount, setDownloadCount] = useState(null);

    const downloadCountFunction = httpsCallable(functions, 'downloads_count');

    const fetchDownloadCount = async () => {
        downloadCountFunction({mode: 'get'})
            .then((result) => {
                if (result?.data?.success) {
                    setDownloadCount(result.data.count);
                } else {
                    console.error('Failed to fetch download count:', result.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching download count:', error);
            });
    };

    const updateDownloadCount = async () => {
        downloadCountFunction({mode: 'set'})
            .then((result) => {
                if (result?.data?.success) {
                    setDownloadCount(result.data.count);
                } else {
                    console.error('Failed to update download count:', result.data);
                }
            })
            .catch((error) => {
                console.error('Error updating download count:', error);
            });
    };

    useEffect(() => {
        fetchDownloadCount();
    }, []);

    const exports = {
        downloadCount,
        updateDownloadCount
    }

    return (
        <DownloadCountContext.Provider value={exports}>
            {children}
        </DownloadCountContext.Provider>
    );
};

const useDownloadCount = () => useContext(DownloadCountContext);

export {
    useDownloadCount,
    DownloadCountProvider
};