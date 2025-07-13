import { createContext, useContext, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

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
                    console.error('Failed to fetch visit count:', result.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching visit count:', error);
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
