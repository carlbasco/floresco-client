import {
  axios,
  setAccessToken,
  axiosInstance,
  getAccessToken,
  Snackbar,
} from '@lib'
import { Dispatch } from 'redux'
import {
  iAuthAction,
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_LOADED,
  AUTH_LOADING,
  AUTH_LOGOUT,
  AUTH_SUCCESS,
  NO_USER,
  iLogin,
} from '../types'

export const authLogin = (loginData: iLogin) => async (
  dispatch: Dispatch<iAuthAction>
) => {
  try {
    dispatch({ type: AUTH_REQUEST })
    const res = await axios.post('/api/auth/login', loginData)
    const data = await res.data
    setAccessToken(data.accessToken)
    dispatch({ type: AUTH_SUCCESS, payload: data.user })
    Snackbar.success(data.msg)
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
    if (err.response.data.verified === false) {
      return err.response.data
    } else {
      Snackbar.error(err.response.data.msg)
    }
  }
}

export const loadAuth = () => async (dispatch: Dispatch<iAuthAction>) => {
  try {
    dispatch({ type: AUTH_LOADING })
    const res = await axios({
      url: '/api/auth/user',
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + getAccessToken(),
      },
    })
    const data = await res.data
    dispatch({ type: AUTH_LOADED, payload: data })
  } catch (err) {
    if (err.response) {
      if (err.response.data.msg === 'Session Expired') {
        Snackbar.error('Session Expired')
      }
    }
    dispatch({ type: NO_USER })
  }
}

export const logoutUser = () => async (dispatch: Dispatch<iAuthAction>) => {
  dispatch({ type: AUTH_REQUEST })
  try {
    await axiosInstance
      .post('/api/auth/logout')
      .then(() => dispatch({ type: AUTH_LOGOUT }))
    Snackbar.info('You have been logout')
    return 'success'
  } catch (err) {
    console.error(err)
    return 'error'
  }
}
