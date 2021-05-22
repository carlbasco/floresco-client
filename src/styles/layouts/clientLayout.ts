import { createStyles, makeStyles, Theme } from '@material-ui/core'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      color: theme.palette.text.primary,
      backgroundImage: 'none',
      boxShadow: 'none',
      backdropFilter: 'blur(8px)',
      backgroundColor: 'transparent',
    },
    appBarLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1em',
      fontWeight: 700,
      margin: '1.5em 0',
      cursor: 'pointer',
    },
    toolbar: {
      [theme.breakpoints.up('lg')]: {
        minHeight: '5.8em',
      },
      paddingLeft: 0,
      paddingRight: 0,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none',
        padding: '0 2.5em',
      },
    },
    content: {
      flexGrow: 1,
      width: '100%',
      height: '100vh',
      padding: '7em 2em 2em ',
      [theme.breakpoints.down('md')]: {
        paddingTop: '5.5em',
        height: 'unset',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '5em .5em 2em',
        height: 'unset',
      },
    },
    toolbarRightIcon: {
      flexGrow: 1,
    },
  })
)

export default useStyles
