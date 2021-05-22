import { makeStyles, Theme } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => ({
  popper: {
    zIndex: theme.zIndex.appBar + 10,
  },
  paperRoot: {
    borderRadius: '8px',
    backgroundImage: 'unset',
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
    padding: '.5em 0',
  },
  typography: {
    marginBottom: '1em',
  },
  dialog: {
    paddingBottom: '.5em',
  },
  formControl: {
    marginBottom: '.5em',
  },
  closeBtn: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  updateAccountBtn: {
    marginTop: '.5em',
    borderRadius: '8px',
  },
  logoutBtn: {
    borderColor: theme.palette.action.active,
  },
  dialogContent: {
    [theme.breakpoints.down('sm')]: {
      padding: '1em 1em',
    },
  },
}))

export default useStyles