import { makeStyles, Theme } from '@material-ui/core'
import { deepPurple, indigo, lightGreen } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) => ({
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  root: {
    marginTop: '2em',
    padding: '1.5em',
    marginBottom: '2em',
  },
  container: {
    [theme.breakpoints.up('xs')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  pendingCard: {
    padding: '1em',
    color: theme.palette.secondary.main,
    height: '145px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pendingIcon: {
    color: theme.palette.secondary.main,
    width: '45px',
    height: '45px',
  },
  onGoingCard: {
    padding: '1em',
    color: indigo[500],
    height: '145px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  onGoingIcon: {
    color: indigo[500],
    width: '45px',
    height: '45px',
  },
  canceledCard: {
    padding: '1em',
    color: theme.palette.error.main,
    height: '145px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  canceledIcon: {
    color: theme.palette.error.main,
    width: '45px',
    height: '45px',
  },
  completedCard: {
    padding: '1em',
    height: '145px',
    color: theme.palette.success.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  completedIcon: {
    color: theme.palette.success.main,
    width: '45px',
    height: '45px',
  },
  incomeCard: {
    padding: '1em',
    height: '145px',
    color: deepPurple[400],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  incomeIcon: {
    color: deepPurple[400],
    width: '45px',
    height: '45px',
  },
  usersCard: {
    padding: '1em',
    height: '145px',
    color: lightGreen[500],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  usersIcon: {
    color: lightGreen[500],
    width: '45px',
    height: '45px',
  },
  contractCard: {
    padding: '1em',
    height: '145px',
    color: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contractIcon: {
    color: theme.palette.primary.main,
    width: '45px',
    height: '45px',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAvatar: {
    width: '60px',
    height: '60px',
    backgroundColor: theme.palette.background.default,
  },
  cardText: {
    color: theme.palette.text.primary,
  },
  noBorderBottom: {
    borderBottom: 0,
  },
  paper: {
    marginTop: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '1em',
    },
    padding: '1.5em',
  },
}))

export default useStyles
