import { BAZAR_TYPES } from '../actions/bazarAction';
import { EditData, DeleteData } from '../actions/globalTypes';

const initialState = {
  loading: false,
  items: [],
  result: 0,
};

const bazarReducer = (state = initialState, action) => {
  switch (action.type) {
    case BAZAR_TYPES.LOADING_ITEM:
      return { ...state, loading: action.payload };

    case BAZAR_TYPES.CREATE_ITEM:
      return { ...state, items: [action.payload, ...state.items] };

    case BAZAR_TYPES.GET_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        result: action.payload.result,
      };

    case BAZAR_TYPES.UPDATE_ITEM:
      return {
        ...state,
        items: EditData(state.items, action.payload._id, action.payload),
      };

    case BAZAR_TYPES.DELETE_ITEM:
      return {
        ...state,
        items: DeleteData(state.items, action.payload),
      };

    default:
      return state;
  }
};

export default bazarReducer;