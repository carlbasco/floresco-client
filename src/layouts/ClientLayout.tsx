import { ReactNode } from 'react'
import Link from 'next/link'
import {
  AppBar,
  Container,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { DarkMode, LightMode, Menu } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'

import { AccountOptionMenu, NotificationMenu } from '@components'
import { iRootState, toggleTheme } from '@redux'
import useStyles from '@styles/layouts/clientLayout'

const ClientLayout = ({ children }: iProps) => {
  const dispatch = useDispatch()
  const user = useSelector((state: iRootState) => state.auth.user)
  const theme = useSelector((state: iRootState) => state.theme)

  const classes = useStyles()
  return (
    <>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Container>
            <Toolbar className={classes.toolbar}>
              <Hidden smDown>
                <Link href="/">
                  <div className={classes.appBarLogo}>
                    <img src="/ff-logo.png" alt="logo" width="40" height="30" />
                    Floresco Funeral
                  </div>
                </Link>
              </Hidden>
              <Hidden smUp>
                <Link href="/">
                  <div className={classes.appBarLogo}>
                    <img src="/ff-logo.png" alt="logo" width="40" height="30" />
                  </div>
                </Link>
              </Hidden>

              {/* <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton> */}
              <Typography variant="h6" noWrap component="div"></Typography>
              <div className={classes.toolbarRightIcon}></div>
              <IconButton
                color="inherit"
                onClick={() => dispatch(toggleTheme())}
              >
                {theme.isDarkMode ? <LightMode /> : <DarkMode color="action" />}
              </IconButton>
              <NotificationMenu />
              <AccountOptionMenu />
            </Toolbar>
          </Container>
        </AppBar>
        <div className={classes.content}>{children}</div>
      </div>
    </>
  )
}

interface iProps {
  children: ReactNode
}

export default ClientLayout
