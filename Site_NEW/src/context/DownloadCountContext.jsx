"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

import * as atatus from 'atatus-spa';


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
                    atatus.notify(new Error('Failed to fetch download count'), {receivedData: result.data}, ['download_count_fetch_error']);
                }
            })
            .catch((error) => {
                atatus.notify(error, {}, ['download_count_fetch_error']);
            });
    };

    const updateDownloadCount = async () => {
        downloadCountFunction({mode: 'set'})
            .then((result) => {
                if (result?.data?.success) {
                    setDownloadCount(result.data.count);
                } else {
                    atatus.notify(new Error('Failed to update download count'), {receivedData: result.data}, ['download_count_update_error']);
                }
            })
            .catch((error) => {
                atatus.notify(error, {}, ['download_count_update_error']);
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