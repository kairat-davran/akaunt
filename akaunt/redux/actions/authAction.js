import { postDataAPI } from "../../utils/fetchData";
import valid from "../../utils/valid";
import { GLOBALTYPES } from "./globalTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI('login', data);

    // Save refresh token in local storage
    await AsyncStorage.setItem("refreshToken", res.data.refresh_token);
    await AsyncStorage.setItem("firstLogin", "true");

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user
      }
    });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err?.response?.data?.msg || err.message
      }
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

  if (!storedRefreshToken) return;

  dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

  try {
    const res = await postDataAPI('refresh_token', { refresh_token: storedRefreshToken });

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user
      }
    });

    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err?.response?.data?.msg || err.message
      }
    });
  }
};

export const register = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0)
    return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg });

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI('register', data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user
      }
    });

    await AsyncStorage.setItem("firstLogin", "true");

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg
      }
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err?.response?.data?.msg || err.message
      }
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await AsyncStorage.multiRemove(["refreshToken", "firstLogin"]);
    await postDataAPI("logout");

    dispatch({ type: GLOBALTYPES.AUTH, payload: {} });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err?.response?.data?.msg || err.message
      }
    });
  }
};