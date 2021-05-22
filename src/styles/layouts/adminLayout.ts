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
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    appBarLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1em',
      fontWeight: 700,
      margin: '1.5em 0',
    },
    appBarChild: {
      [theme.breakpoints.up('lg')]: {
        minHeight: '5.8em',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none',
        padding: '0 2.5em',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      boxSizing: 'border-box',
      width: drawerWidth,
      backgroundColor: theme.palette.background.default,
      backgroundImage: 'unset',
    },
    content: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      padding: '7em 2em 2em',
      [theme.breakpoints.down('md')]: {
        paddingTop: '5.5em',
        height: 'unset',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '4em 1em 2em',
        height: 'unset',
      },
    },
    toolbarRightIcon: {
      flexGrow: 1,
    },
    profilePaper: {
      padding: '1em',
      margin: '1em',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileDetail: {
      marginLeft: '1em',
    },
    listItem: {
      paddingLeft: '2em',
      paddingTop: '1em',
      paddingBottom: '1em',
    },
    list: {
      marginTop: '1em',
    },
  })
)

export default useStyles
