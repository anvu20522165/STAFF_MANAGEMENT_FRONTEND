import axiosInstance from "./axios-instance";
import queryString from "query-string";
import {NotificationType} from "../constants/notification";

/**
 * call api to get notifications
 *
 * @param type
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getAllNotifications = (type) => {
    const query = queryString.stringify({
        ...(Object.values(NotificationType).includes(type) && {type})
    })
    return axiosInstance.get(`/notification/get-all?${query}`)
}
