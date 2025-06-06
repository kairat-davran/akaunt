import { EVENT_TYPES } from '../actions/eventAction';
import { EditData, DeleteData } from '../actions/globalTypes';

const initialState = {
  loading: false,
  events: [],
  result: 0,
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT_TYPES.LOADING_EVENT:
      return { ...state, loading: action.payload };
    case EVENT_TYPES.CREATE_EVENT:
      return { ...state, events: [action.payload, ...state.events] };
    case EVENT_TYPES.GET_EVENTS:
      return { ...state, events: action.payload.events, result: action.payload.result };
    case EVENT_TYPES.UPDATE_EVENT:
      return { ...state, events: EditData(state.events, action.payload._id, action.payload) };
    case EVENT_TYPES.DELETE_EVENT:
      return { ...state, events: DeleteData(state.events, action.payload) };
    default:
      return state;
  }
};

export default eventReducer;