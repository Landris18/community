import { useState } from 'react';
import MembresContext from './MembresContext';

const MembresProvider = ({ children }: { children: any }) => {
    const [membres, setMembres] = useState();

    const setMembresData = (membresData: any) => {
        setMembres(membresData);
    };

    return (
        <MembresContext.Provider value={{ membres, setMembresData }}>
            {children}
        </MembresContext.Provider>
    )
}

export default MembresProvider;