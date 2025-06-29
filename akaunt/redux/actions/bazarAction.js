import { GLOBALTYPES } from './globalTypes';
import {
  getDataAPI,
  postDataAPI,
  deleteDataAPI,
  patchDataAPI
} from '../../utils/fetchData';
import { uploadMediaToServer } from '../../utils/imageUpload';

export const BAZAR_TYPES = {
  CREATE_ITEM: 'CREATE_ITEM',
  GET_ITEMS: 'GET_ITEMS',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  LOADING_ITEM: 'LOADING_ITEM',
};

// Create Item
export const createItem = ({ data, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    let media = [];
    if (data.images?.length > 0) {
      media = await uploadMediaToServer(data.images[0].file, auth.token);
    }

    const payload = { ...data, images: media.filter(Boolean) };
    const res = await postDataAPI('bazar', payload, auth.token);

    dispatch({ type: BAZAR_TYPES.CREATE_ITEM, payload: res.data.newItem });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Item creation failed',
      },
    });
  }
};

// Get Items
export const getItems = (token) => async (dispatch) => {
  try {
    dispatch({ type: BAZAR_TYPES.LOADING_ITEM, payload: true });
    const res = await getDataAPI('bazar', token);
    dispatch({ type: BAZAR_TYPES.GET_ITEMS, payload: res.data });
    dispatch({ type: BAZAR_TYPES.LOADING_ITEM, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Failed to load items',
      },
    });
  }
};

// Update Item
export const updateItem = ({ data, auth }) => async (dispatch) => {
  try {
    let media = [];
    if (data.images?.length > 0) {
      media = await uploadMediaToServer(data.images[0].file, auth.token);
    }

    const res = await patchDataAPI(`bazar/${data.id}`, {
      ...data,
      images: media.filter(Boolean),
    }, auth.token);

    dispatch({ type: BAZAR_TYPES.UPDATE_ITEM, payload: res.data.updatedItem });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Update failed',
      },
    });
  }
};

// Delete Item
export const deleteItem = ({ id, auth }) => async (dispatch) => {
  try {
    await deleteDataAPI(`bazar/${id}`, auth.token);
    dispatch({ type: BAZAR_TYPES.DELETE_ITEM, payload: id });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Delete failed',
      },
    });
  }
};