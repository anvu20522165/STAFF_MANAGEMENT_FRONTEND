import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getNotificationNoReadCount} from "../../services/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";


const fetchNoReadCountThunk = createAsyncThunk(
    'notification/fetchNoReadCount',
    async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken')
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken?.id) {
                const {data} = await getNotificationNoReadCount(decodedToken?.id)
                return isNaN(Number(data)) ? 0 : Number(data)
            } else {
                return 0
            }
        } catch (e) {
            console.error('fetchNoReadCountThunk: ', e)
            return 0
        }
    }
)


const NotificationReducer = createSlice({
    name: 'baseApiCustom',
    initialState: {
        noReadCount: 0,
    },
    reducers: {
        setNoReadCount: (state, action) => {
            state.noReadCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNoReadCountThunk.fulfilled, (state, action) => {
            state.noReadCount = action.payload
        })
    }
});

export const NotificationActions = NotificationReducer.actions;

export const NotificationActionsThunk = {
    fetchNoReadCountThunk
}
export default NotificationReducer.reducer;
