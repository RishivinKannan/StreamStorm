"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

import * as atatus from 'atatus-spa';

const VisitCountContext = createContext();

const VisitCountProvider = ({ children }) => {
    const [visitCount, setVisitCount] = useState(null);

    const visitCountFunction = httpsCallable(functions, 'visit_count');

    const fetchVisitCount = async () => {

        visitCountFunction()
            .then((result) => {
                if (result?.data?.success) {
                    setVisitCount(result.data.count);
                } else {
                    atatus.notify(new Error('Failed to fetch visit count'), {receivedData: result.data}, ['visit_count_fetch_error']);
                }
            })
            .catch((error) => {
                atatus.notify(error, {}, ['visit_count_fetch_error']);
            });
    };


    useEffect(() => {
        fetchVisitCount();
    }, []);

    return (
        <VisitCountContext.Provider value={visitCount}>
            {children}
        </VisitCountContext.Provider>
    );
};

const useVisitCount = () => useContext(VisitCountContext)

export { useVisitCount, VisitCountProvider };
