import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  container: {
    [theme.breakpoints.up('xs')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}))

export default useStyles
