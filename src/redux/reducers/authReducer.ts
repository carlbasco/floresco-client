import { HYDRATE } from 'next-redux-wrapper'
import {
  iAuthState,
  iAuthAction,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOADED,
  AUTH_LOADING,
  AUTH_LOGOUT,
  NO_USER,
} from '../types'

export const initialState = {
  user: {
    id: '',
    email:'',
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
  },
  isLoading: true,
  isAuthenticated: false,
  fetchRequest: false,
}

const authReducer = (state: iAuthState = initialState, action: iAuthAction) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.auth }
    case AUTH_REQUEST:
      return {
        ...state,
        isLoading: false,
        fetchRequest: true,
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        fetchRequest: false,
      }
    case AUTH_ERROR:
      return {
        ...initialState,
        isLoading: false,
      }
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case AUTH_LOADED:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        fetchRequest: false,
      }
    case NO_USER: 
    case AUTH_LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

export default authReducer
