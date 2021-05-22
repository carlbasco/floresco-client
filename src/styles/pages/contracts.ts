import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: '1.5em',
    padding: '1.5em',
    [theme.breakpoints.down('sm')]: {
      padding: '1em',
    },
  },
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
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
  paperHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noBorderBottom: {
    borderBottom: 0,
  },
}))

export default useStyles
