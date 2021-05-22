import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { ThemeProvider } from '@material-ui/core'

import { darkTheme, defaultTheme } from '@styles/theme'
import { Loading } from '@components'
import {
  toggleTheme,
  setDarkMode,
  setDefaultMode,
  iRootState,
  iAuthState,
  iThemeState,
} from '@redux'

const AppWrapper = (props: iProps) => {
  const { setDefaultMode, setDarkMode, children, themeState, authState } = props
  useEffect(() => {
    const theme = localStorage.getItem('darkMode')
    if (theme) {
      theme === 'true' ? setDarkMode() : setDefaultMode()
    } else {
      setDefaultMode()
    }
  }, [])
  
  return (
    <>
      <ThemeProvider theme={themeState.isDarkMode ? darkTheme : defaultTheme}>
        {authState.isLoading ? <Loading /> : children}
      </ThemeProvider>
    </>
  )
}

interface iProps {
  authState: iAuthState
  themeState: iThemeState
  toggleTheme: () => void
  setDarkMode: () => void
  setDefaultMode: () => void
  children: ReactNode
}

const mapStateToProps = (state: iRootState) => ({
  themeState: state.theme,
  authState: state.auth,
})

const mapActionToProps = {
  toggleTheme,
  setDarkMode,
  setDefaultMode,
}

export default connect(mapStateToProps, mapActionToProps)(AppWrapper)
