import { MouseEvent, useState } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Fade,
  Hidden,
  IconButton,
  ListItemIcon,
  MenuItem,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { DarkMode, LightMode, Menu } from '@material-ui/icons'
import { iRootState, toggleTheme } from '@redux'

import useStyles from '@styles/layouts/homeLayout'

const HomeLayout = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: iRootState) => state.theme)

  const [arrowRef, setArrowRef] = useState<HTMLSpanElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const handleClickOpenNotif = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }
  const handleClickCloseNotif = () => {
    setOpen(false)
  }
  const modifiers = [
    {
      name: 'arrow',
      enabled: true,
      options: {
        element: arrowRef,
      },
    },
  ]

  const classes = useStyles()
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Floresco Funeral
            </Typography>
            <Hidden smDown>
              {links.map((item) => (
                <Link href={item.link} key={item.title}>
                  <Button color="inherit" variant="text">
                    {item.title}
                  </Button>
                </Link>
              ))}
              <IconButton
                aria-label="toggleDarkMode"
                onClick={() => dispatch(toggleTheme())}
              >
                {theme.isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Hidden>
            <Hidden smUp>
              <IconButton
                aria-label="toggleDarkMode"
                onClick={() => dispatch(toggleTheme())}
              >
                {theme.isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              <IconButton onClick={(e) => handleClickOpenNotif(e)}>
                <Menu />
              </IconButton>
              <Popper
                transition
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                modifiers={modifiers}
                className={classes.popper}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper className={classes.paperRoot} elevation={4}>
                      <ClickAwayListener onClickAway={handleClickCloseNotif}>
                        <div>
                          <span className={classes.arrow} ref={setArrowRef} />
                          <div>
                            {links.map((item) => (
                              <Link href={item.link} key={item.title}>
                                <MenuItem className={classes.menuItem}>
                                  {item.title}
                                </MenuItem>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Hidden>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

const links = [
  { link: '/', title: 'About' },
  { link: '/', title: 'Service' },
  { link: '/login', title: 'Login' },
]

export default HomeLayout
