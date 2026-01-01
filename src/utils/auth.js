// Token management utilities

const TOKEN_KEY = 'calendar_auth_token';
const USER_KEY = 'calendar_user';

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const getUser = () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};
