import axiosInstance from "./axios-instance";

/**
 * call api to get all users
 *
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getAllUsers = () => {
    return axiosInstance.get('/user/users')
}