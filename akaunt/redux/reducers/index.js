import { combineReducers } from "redux"
import auth from "./authReducer"
import alert from "./alertReducer"
import theme from "./themeReducer"
import profile from "./profileReducer"
import status from "./statusReducer"
import homePosts from "./postReducer"
import modal from "./modalReducer"
import detailPost from "./detailPostReducer"
import discover from "./discoverReducer"
import suggestions from "./suggestionsReducer"
import communicationReducer from "./communicationSlice"
import notify from "./notifyReducer"
import message from "./messageReducer"
import online from "./onlineReducer"
import call from "./callReducer"
import events from "./eventReducer"
import bazar from './bazarReducer';

export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    homePosts,
    modal,
    detailPost,
    discover,
    suggestions,
    notify,
    events,
    bazar,
    communication: communicationReducer,
    message,
    online,
    call,
})