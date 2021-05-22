import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  btnClose: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogContent: {
    [theme.breakpoints.down('sm')]: {
      padding: '1em 1em',
    },
  },
  formControl: {
    marginBottom: '1em',
  },
}))

export default useStyles