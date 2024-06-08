import { useState } from 'react';
import DettesContext from './DettesContext';

const DettesProvider = ({ children }: { children: any }) => {
    const [dettes, setDettes] = useState();

    const setDettesData = (dettesData: any) => {
        setDettes(dettesData);
    };

    return (
        <DettesContext.Provider value={{ dettes, setDettesData }}>
            {children}
        </DettesContext.Provider>
    )
}

export default DettesProvider;