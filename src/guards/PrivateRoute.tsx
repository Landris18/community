import { ReactNode, useContext, useEffect, useState } from 'react';
import UserContext from '../contexts/user/UserContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import Service from '../services/services';
import { isTokenExpired } from '../utility/utility';
import LoadingGlobal from '../components/LoadingGlobal/LoadingGlobal';

interface PrivateRouteProps {
    children: ReactNode;
    page: string;
    redirectTo: string;
}

const PrivateRoute = ({ children, page, redirectTo }: PrivateRouteProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, setUserData } = useContext(UserContext);
    const storedToken = JSON.parse(localStorage.getItem('accessToken') as string);
    const [loading, setLoading] = useState<boolean>(true);

    const { isLoading } = useQuery(
        'user',
        () => Service.getOneMembre(storedToken.userId),
        {
            enabled: false,
            retry: false,
            onSuccess: (data: any) => {
                setUserData(data.success[0]);
                if (page === 'login') {
                    navigate(redirectTo, { replace: true });
                }
            },
        }
    );

    useEffect(() => {
        const handleNavigation = async () => {
            if (page === 'login' && !isTokenExpired()) {
                if (!queryClient.getQueryData('user')) {
                    await queryClient.prefetchQuery('user');
                } else {
                    navigate(redirectTo, { replace: true });
                }
            }

            if (page === 'dashboard') {
                if (isTokenExpired()) {
                    navigate(redirectTo, { replace: true });
                } else if (!user && !queryClient.getQueryData('user')) {
                    await queryClient.prefetchQuery('user');
                }
            }
        };
        handleNavigation();
        setLoading(false);
    }, [page, redirectTo, user, queryClient, navigate]);

    return <>{(isLoading || loading) ? <LoadingGlobal /> : children}</>;
};

export default PrivateRoute;