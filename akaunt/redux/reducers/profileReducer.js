import { EditData } from "../actions/globalTypes";
import { PROFILE_TYPES } from "../actions/profileAction";

const initialState = {
    loading: false,
    ids: [],
    users: [],
    posts: []
}

const profileReducer = (state = initialState, action) => {
    switch (action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case PROFILE_TYPES.GET_USER:
            return {
                ...state,
                users: [...state.users,
                    ...(state.users.find(user => user._id === action.payload.user._id)
                    ? [] : [action.payload.user])]
                // users: [...state.users, action.payload.user]
            };
        case PROFILE_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.GET_ID:
            return {
                ...state,
                ids: [...state.ids,
                    ...(state.ids.find(id => id === action.payload)
                    ? [] : [action.payload])]
                // ids: [...state.ids, action.payload]
            };
        case PROFILE_TYPES.GET_POSTS:
            return {
                ...state,
                posts: [...state.posts,
                    ...(state.posts.find(post => post._id === action.payload._id)
                    ? [] : [action.payload])]
                // posts: [...state.posts, action.payload]
            };
        case PROFILE_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default profileReducer