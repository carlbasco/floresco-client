import { Dispatch } from 'redux'
import { DARK_MODE, DEFAULT_MODE, iThemeAction, TOGGLE_THEME } from '../types'

export const setDarkMode = () => (dispatch: Dispatch<iThemeAction>) => {
  localStorage.setItem('darkMode', 'true')
  dispatch({ type: DARK_MODE })
}

export const setDefaultMode = () => (dispatch: Dispatch<iThemeAction>) => {
  localStorage.setItem('darkMode', 'false')
  dispatch({ type: DEFAULT_MODE })
}

export const toggleTheme = () => (dispatch: Dispatch<iThemeAction>) => {
  dispatch({ type: TOGGLE_THEME })
}
