import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '3em',
      paddingRight: '3em',
    },
  },
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  noBorderCell: {
    borderBottom: 0,
  },
  pageSubtitle: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '1em',
    },
    marginTop: '2.5em',
    marginBottom: '.5em',
  },
  paper: {
    [theme.breakpoints.down('sm')]: {
      padding: '1em',
    },
    padding: '1.5em',
  },
  payment:{
    color:theme.palette.success.main
  }
}))

export default useStyles
