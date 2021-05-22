import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '3em',
      paddingRight: '3em',
    },
    paddingBottom: '2em',
  },
  grid:{
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
    },
  },
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  pageSubtitle: {
    marginTop: '2.5em',
    [theme.breakpoints.down('sm')]: {
      marginTop: '1em',
    },
  },
  paper: {
    marginTop: '1em',
    padding: '2em',
  },
  btn: {
    marginTop: '1em',
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  cartItems: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  totalPrice: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
}))

export default useStyles
