import { wrapper, store, makeStore } from './store'
import { authLogin, loadAuth, logoutUser } from './actions/authAction'
import { setDarkMode, setDefaultMode, toggleTheme } from './actions/themeAction'
import {
  iLogin,
  iAuthState,
  iAuthAction,
  iThemeState,
  iThemeAction,
  iDispatch,
  iAction,
  iState,
  iRootState,
  AUTH_ERROR,
  AUTH_LOADED,
  AUTH_LOADING,
  AUTH_LOGOUT,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  NO_USER,
  DARK_MODE,
  DEFAULT_MODE
} from './types'

export type {
  iLogin,
  iAuthState,
  iAuthAction,
  iThemeState,
  iThemeAction,
  iDispatch,
  iAction,
  iState,
  iRootState,
}
export {
  wrapper,
  store,
  makeStore,
  authLogin,
  loadAuth,
  logoutUser,
  setDarkMode,
  setDefaultMode,
  toggleTheme,
  AUTH_ERROR,
  AUTH_LOADED,
  AUTH_LOADING,
  AUTH_LOGOUT,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  NO_USER,
  DARK_MODE,
  DEFAULT_MODE,
}
