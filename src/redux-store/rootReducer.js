import {combineReducers} from "@reduxjs/toolkit";
import NotificationReducer from './reducers/notification';


const rootReducer = combineReducers({
  notification: NotificationReducer
});

export default rootReducer;
