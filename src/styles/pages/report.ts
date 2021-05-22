import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  paper: {
    padding: '1.5em 2em',
    marginTop: '1.5em',
  },
}))

export default useStyles
