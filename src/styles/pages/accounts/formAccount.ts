import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  root: {
    marginTop: '2em',
    paddingBottom: '2em',
  },
  paper: {
    padding: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '1em',
    },
  },
  container: {
    maxHeight: 440,
  },
  formControl: {
    marginBottom: '.5em',
  },
  button: {
    borderRadius: '8px',
  },
  skeleton: {
    borderRadius: '8px',
  },
}))

export default useStyles
