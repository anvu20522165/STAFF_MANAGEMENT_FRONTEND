import {createSlice} from '@reduxjs/toolkit';

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
});

export const NotificationActions = NotificationReducer.actions;
export default NotificationReducer.reducer;
