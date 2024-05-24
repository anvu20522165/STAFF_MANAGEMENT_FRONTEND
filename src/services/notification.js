import axiosInstance from "./axios-instance";

export const getAllNotifications = () => {
    return axiosInstance.get('/notification/get-all')
}