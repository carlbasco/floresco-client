import { HYDRATE } from 'next-redux-wrapper'
import { ThunkDispatch } from 'redux-thunk'

//Auth type
export interface iUser {
  id: string
  email:string
  firstName: string
  middleName: string
  lastName: string
  role: string
}
export interface iAuthState {
  user: iUser
  isLoading: boolean
  isAuthenticated: boolean
  fetchRequest: boolean
}
export interface iLogin {
  email: string
  password: string
}

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_LOADING = 'AUTH_LOADING'
export const AUTH_LOADED = 'AUTH_LOADED'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const NO_USER = 'NO_USER'
export interface AuthRequest {
  type: typeof AUTH_REQUEST
}
export interface AuthSuccess {
  type: typeof AUTH_SUCCESS
  payload: iAuthState
}
export interface AuthError {
  type: typeof AUTH_ERROR
}
export interface AuthLoading {
  type: typeof AUTH_LOADING
}
export interface AuthLoaded {
  type: typeof AUTH_LOADED
  payload: iAuthState
}
export interface AuthLogout {
  type: typeof AUTH_LOGOUT
}
export interface NoUser {
  type: typeof NO_USER
}
export interface Hydrate {
  type: typeof HYDRATE
  payload:any
}
export type iAuthAction =
  | AuthRequest
  | AuthSuccess
  | AuthError
  | AuthLoading
  | AuthLoaded
  | AuthLogout
  | NoUser
  | Hydrate

///THEME TYPES
export interface iThemeState {
  isDarkMode: boolean
}
export const DARK_MODE = 'DARK_MODE'
export const DEFAULT_MODE = 'DEFAULT_MODE'
export const TOGGLE_THEME = 'TOGGLE_THEME'
export interface DarkMode {
  type: typeof DARK_MODE
}
export interface DefaultMode {
  type: typeof DEFAULT_MODE
}
export interface ToggleTheme {
  type: typeof TOGGLE_THEME
}
export type iThemeAction = DarkMode | DefaultMode | ToggleTheme 

//DISPATCH TYPE
export type iDispatch = ThunkDispatch<
  iAuthState,
  any,
  iAuthAction | iThemeAction
>

export type iState = iAuthState | iThemeState
export type iAction = iAuthAction | iThemeAction

export interface iRootState {
  theme: iThemeState
  auth: iAuthState
}
