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
    width: '100%',
    padding: '1em 1em 0',
  },
  container: {
    [theme.breakpoints.up('xs')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  tabPanel:{
    padding:0
  }
}))

export default useStyles
