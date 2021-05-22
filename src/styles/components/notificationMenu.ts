import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popper: {
      zIndex: theme.zIndex.appBar + 10,
    },
    paperRoot: {
      borderRadius: '8px',
      backgroundImage: 'unset',
      width: '270px',
      marginLeft: '1em',
    },
    arrow: {
      position: 'absolute',
      width: '1em',
      height: '1em',
      boxSizing: 'border-box',

      '&::before': {
        color: theme.palette.background.paper,
        overflow: 'hidden',
        content: '""',
        margin: 'auto',
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        transform: 'rotate(45deg)',
        marginTop: '-5px',
      },
    },
    content: {
      padding: '1em 0',
    },
    notificationList: {
      height: '300px',
      overflowX: 'hidden',
    },
    timestamp: {
      fontSize: '.7em',
      marginTop: '.5em',
      textAlign: 'right',
      color: theme.palette.text.secondary,
    },
    notifHeader: {
      padding: '0 1em',
    },
    mark: {
      textAlign: 'center',
      fontSize: '.8em',
      fontWeight:600,
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
  })
)

export default useStyles
