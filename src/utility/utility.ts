const FR_LOCALE = 'fr-FR';

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

export const removeToken = () => {
    localStorage.removeItem('accessToken');
};

export const isTokenExpired = () => {
    const storedToken = JSON.parse(localStorage.getItem('accessToken') as string);
    if (!storedToken || !storedToken.userId) return true;
    return new Date() >= new Date(storedToken.expiresAt);
};

export const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const MONTHS_LIST = Array.from({ length: 12 }, (_, index) => {
    const formatterShort = new Intl.DateTimeFormat(FR_LOCALE, { month: 'short' });
    const formatterLong = new Intl.DateTimeFormat(FR_LOCALE, { month: 'long' });
    const date = new Date(2000, index, 1);
    return {
        short: capitalizeFirstLetter(formatterShort.format(date)),
        long: capitalizeFirstLetter(formatterLong.format(date))
    };
});

export const formatNumber = (number: number) => {
    return number?.toLocaleString().replace(/,/g, ' ');
};

export const getYearsBetween = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const years = [];

    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
    }
    return years;
};