export const storeToken = (accessToken: string, userId: number) => {
    const expiresAt = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
    const tokenData = {
        accessToken: accessToken,
        expiresAt: expiresAt.toISOString(),
        userId: userId
    };
    localStorage.setItem('accessToken', JSON.stringify(tokenData));
};

export const getToken = () => {
    const storedToken = JSON.parse(localStorage.getItem('accessToken') as string);
    return storedToken.accessToken;
};

export const isTokenExpired = () => {
    const storedToken = JSON.parse(localStorage.getItem('accessToken') as string);
    if (!storedToken || !storedToken.userId) return true;
    return new Date() >= new Date(storedToken.expiresAt);
};