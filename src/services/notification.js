import axiosInstance from "./axios-instance";
import queryString from "query-string";
import {NotificationType} from "../constants/notification";

/**
 * call api to get notifications
 *
 * @param type
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getAllNotifications = (type = undefined) => {
    const query = queryString.stringify({
        ...(Object.values(NotificationType).includes(type) && {type})
    })
    return axiosInstance.get(`/notification/get-all?${query}`)
}

/**
 * call api to create new notification
 *
 * @param payload
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createNotification = (payload) => {
    return axiosInstance.post('/notification/create', payload)
}

/**
 * call api to update notification
 *
 * @param id
 * @param payload
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateNotification = (id, payload) => {
    return axiosInstance.put(`/notification/${id}`, payload)
}

/**
 * call api to delete notification
 *
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteNotification = (id) => {
    return axiosInstance.delete(`/notification/${id}`)
}

/**
 * get notification by user
 *
 * @param userId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getNotificationsByUserId = (userId) => {
    return axiosInstance.get(`/notification/user/${userId}`)
}