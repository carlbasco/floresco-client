import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme:Theme) => ({
  header: {
    marginBottom: '2.5em',
  },
  title: {
    fontWeight: 600,
  },
  formControl: {
    marginBottom: '1.2em',
  },
  loginBottom: {
    display: 'flex',
    marginBottom: '20px',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.secondary.main,
    },
  },
  loginFooter: {
    display: 'flex',
    flexWrap: 'nowrap',
    marginTop: '1em',
    justifyContent: 'center',
  },
  registerLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main,
    },
  },
}))

export default useStyles
