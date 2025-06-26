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

// Create Event
export const createEvent = ({ data, auth, socket }) => async (dispatch) => {
  let media = []

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    if (data.images?.length > 0) {
      media = await uploadMediaToServer(data.images[0].file, auth.token);
    }

    const payload = { ...data, images: media.filter(Boolean) }

    const res = await postDataAPI('events', payload, auth.token)

    dispatch({ type: EVENT_TYPES.CREATE_EVENT, payload: res.data.newEvent })

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })

    // Optional: Send notification via socket
    // socket.emit('newEvent', res.data.newEvent)
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Event creation failed' }
    })
  }
}

// Get Events
export const getEvents = (token) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_TYPES.LOADING_EVENT, payload: true })

    const res = await getDataAPI('events', token)

    dispatch({ type: EVENT_TYPES.GET_EVENTS, payload: res.data })
    dispatch({ type: EVENT_TYPES.LOADING_EVENT, payload: false })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Failed to load events' }
    })
  }
}

// Update Event
export const updateEvent = ({ data, auth }) => async (dispatch) => {
  try {
    let media = []
  
    if (data.images?.length > 0) {
      media = await uploadMediaToServer(data.images[0].file, auth.token);
    }

    const res = await patchDataAPI(`event/${data.id}`, {
      ...data, images: media.filter(Boolean)
    }, auth.token);

    dispatch({ type: EVENT_TYPES.UPDATE_EVENT, payload: res.data.updatedEvent })

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Update failed' }
    })
  }
}

// Delete Event
export const deleteEvent = ({ id, auth }) => async (dispatch) => {
  try {
    await deleteDataAPI(`event/${id}`, auth.token)
    dispatch({ type: EVENT_TYPES.DELETE_EVENT, payload: id })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Delete failed' }
    })
  }
}