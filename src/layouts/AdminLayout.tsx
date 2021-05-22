import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  Backpack,
  CalendarToday,
  DarkMode,
  Dashboard,
  LightMode,
  Menu,
  NoteAlt,
  Report,
  SupervisorAccount,
} from '@material-ui/icons'
import {
  AppBar,
  Avatar,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { iRootState, toggleTheme } from '@redux'
import { AccountOptionMenu, NotificationMenu } from '@components'
import useStyles from '@styles/layouts/adminLayout'

const AdminLayout = ({ children, window, index }: iProps) => {
  const dispatch = useDispatch()
  const user = useSelector((state: iRootState) => state.auth.user)
  const theme = useSelector((state: iRootState) => state.theme)
  const accountName =
    !user.middleName || user.middleName === null
      ? user.firstName + ' ' + user.lastName
      : user.firstName + ' ' + user.middleName + ' ' + user.lastName

  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(index)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const handleListItemClick = (e: any, index: number) => {
    setSelectedIndex(index)
    setMobileOpen(false)
  }

  const itemList = [
    {
      text: 'Dashboard',
      link: '/admin',
      index: 0,
      icon: <Dashboard color={selectedIndex === 0 ? 'primary' : 'secondary'} />,
    },
    {
      text: 'Schedules',
      link: '/admin/schedules',
      index: 2,
      icon: (
        <CalendarToday color={selectedIndex === 2 ? 'primary' : 'secondary'} />
      ),
    },
    {
      text: 'File Maintenance',
      link: '/admin/filemaintenance',
      index: 3,
      icon: <Backpack color={selectedIndex === 3 ? 'primary' : 'secondary'} />,
    },
    {
      text: 'Accounts',
      link: '/admin/accounts',
      index: 4,
      icon: (
        <SupervisorAccount
          color={selectedIndex === 4 ? 'primary' : 'secondary'}
        />
      ),
    },
    {
      text: 'Report',
      link: '/admin/reports',
      index: 5,
      icon: <Report color={selectedIndex === 5 ? 'primary' : 'secondary'} />,
    },
  ]

  const classes = useStyles()
  const drawer = (
    <div>
      <div className={classes.appBarLogo}>
        <img src="/ff-logo.png" alt="logo" width="40" height="30" />
        Floresco Funeral
      </div>
      <Paper elevation={17} className={classes.profilePaper}>
        <Avatar alt="user"></Avatar>
        <div className={classes.profileDetail}>
          <Typography variant="h6" fontWeight="600" fontSize=".8em">
            {accountName}
          </Typography>
          <Typography variant="subtitle2" fontSize=".7em">
            {user.role}
          </Typography>
        </div>
      </Paper>
      <List className={classes.list}>
        {itemList.map((item, i) => {
          const { text, link, index, icon } = item
          return (
            <Link href={link} key={i}>
              <ListItem
                button
                className={classes.listItem}
                selected={selectedIndex === index}
                onClick={(e) => handleListItemClick(e, index)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          )
        })}
      </List>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.appBarChild}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div"></Typography>
          <div className={classes.toolbarRightIcon}></div>
          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
            {theme.isDarkMode ? <LightMode /> : <DarkMode color="action" />}
          </IconButton>
          <NotificationMenu />
          <AccountOptionMenu />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <div className={classes.content}>{children}</div>
    </div>
  )
}

interface iProps {
  children: ReactNode
  window?: () => Window
  index: number
}

export default AdminLayout
