import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popper: {
      zIndex: theme.zIndex.appBar + 10,
    },
    paperRoot: {
      borderRadius: '8px',
      backgroundImage: 'unset',
      marginRight: '1em',
      width: '100%',
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
    menuItem: {
      justifyContent: 'center',
    },
  })
)

export default useStyles
