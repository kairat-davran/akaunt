import { GLOBALTYPES } from './globalTypes'
import { uploadMediaToServer } from '../../utils/imageUpload'
import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData'

export const EVENT_TYPES = {
  CREATE_EVENT: 'CREATE_EVENT',
  GET_EVENTS: 'GET_EVENTS',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  LOADING_EVENT: 'LOADING_EVENT',
}

export const createEvent = ({ data, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    // const media = await Promise.all(data.images.map(file => uploadMediaToServer(file)));
    const media = await Promise.all(
      data.images.map(img =>
        img?.file ? uploadMediaToServer(img.file) : img?.uri ? uploadMediaToServer(img.uri) : null
      )
    );
    const payload = { ...data, images: media.filter(Boolean) };

    const res = await postDataAPI('events', payload, auth.token);
    dispatch({ type: EVENT_TYPES.CREATE_EVENT, payload: res.data.newEvent });

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg } });
  }
};

export const getEvents = (token) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_TYPES.LOADING_EVENT, payload: true });
    const res = await getDataAPI('events', token);
    dispatch({ type: EVENT_TYPES.GET_EVENTS, payload: res.data });
    dispatch({ type: EVENT_TYPES.LOADING_EVENT, payload: false });
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg } });
  }
};

export const updateEvent = ({ id, data, auth }) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`event/${id}`, data, auth.token);
    dispatch({ type: EVENT_TYPES.UPDATE_EVENT, payload: res.data.updatedEvent });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg } });
  }
};

export const deleteEvent = ({ id, auth }) => async (dispatch) => {
  try {
    await deleteDataAPI(`event/${id}`, auth.token);
    dispatch({ type: EVENT_TYPES.DELETE_EVENT, payload: id });
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg } });
  }
};