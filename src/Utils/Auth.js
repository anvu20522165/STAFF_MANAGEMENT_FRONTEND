export const setAccessToken = (accsess_token) => {
    return localStorage.setItem('access_token', accsess_token);
};

export const getAccessToken = () => {
    return localStorage.getItem('access_token') || "";
};
