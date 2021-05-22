import {
  DARK_MODE,
  DEFAULT_MODE,
  iThemeAction,
  iThemeState,
  TOGGLE_THEME,
} from '../types'

export const initialState = {
  isDarkMode: false,
}

const themeReducer = (
  state: iThemeState = initialState,
  action: iThemeAction
) => {
  switch (action.type) {
    case DARK_MODE:
      return {
        ...state,
        isDarkMode: true,
      }
    case DEFAULT_MODE:
      return {
        ...state,
        isDarkMode: false,
      }
    case TOGGLE_THEME:
      const val = state.isDarkMode
      val
        ? localStorage.setItem('darkMode', 'false')
        : localStorage.setItem('darkMode', 'true')
      return {
        ...initialState,
        isDarkMode: !val,
      }

    default:
      return state
  }
}

export default themeReducer
