import { useState } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState();

    const setUserData = (userData: any) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;