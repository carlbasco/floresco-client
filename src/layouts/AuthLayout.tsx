import { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, IconButton } from '@material-ui/core'
import { DarkMode, LightMode } from '@material-ui/icons'

import { iRootState, toggleTheme } from '@redux'
import useStyles from '@styles/layouts/authLayout'

const AuthLayout = ({ children }: iProps) => {
  const dispatch = useDispatch()
  const theme = useSelector((state: iRootState) => state.theme)
  const classes = useStyles()
  return (
    <>
      <div className={classes.div}>
        <IconButton
          className={classes.toggleTheme}
          aria-label="toggleDarkMode"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme.isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
        <Container maxWidth="sm">
          <div className={classes.container}>{children}</div>
        </Container>
      </div>
    </>
  )
}

interface iProps {
  children: ReactNode
}

export default AuthLayout
