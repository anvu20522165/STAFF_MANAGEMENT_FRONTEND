import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.API_ENDPOINT || 'http://localhost:5555/v1/',
    headers: {
        Authorization: `Bearer ${window?.localStorage.getItem('accessToken')}`,
    },
});

export default axiosInstance;
