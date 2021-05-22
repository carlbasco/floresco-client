import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  btnClose: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
  content: {
    marginBottom: '1em',
    [theme.breakpoints.down('sm')]: {
      padding: '1em .5em',
    },
  },
}))

export default useStyles
