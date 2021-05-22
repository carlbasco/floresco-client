import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme:Theme) => ({
  header: {
    marginBottom: '1.2em',
  },
  title:{
    fontWeight:600
  },
  formControl: {
    marginBottom: '1.2em',
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    borderRadius: '8px',
  },
  formFooter: {
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
