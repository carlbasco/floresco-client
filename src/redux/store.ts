import { Context, createWrapper, MakeStore } from 'next-redux-wrapper'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { iDispatch, iState, iAction } from '@redux'
import auth from './reducers/authReducer'
import theme from './reducers/themeReducer'

const reducers = combineReducers({ auth, theme })
const middleWare = thunkMiddleware as ThunkMiddleware<iState, iAction, any>

const composeEnhancers = composeWithDevTools({ trace: true })
const compose =
  process.env.NODE_ENV === 'development'
  ? composeEnhancers(applyMiddleware<iDispatch, any>(middleWare))
  : applyMiddleware<iDispatch, any>(middleWare)

export const store = createStore(
  reducers,
  compose
)

export const makeStore: MakeStore = (context: Context) => store
export const wrapper = createWrapper(makeStore)
