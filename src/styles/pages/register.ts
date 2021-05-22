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
  button: {
    borderRadius: '8px',
  },
  textTerms: {
    marginBottom:'1em',
    textAlign: 'justify',
    '& a': {
      color: theme.palette.secondary.main,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}))

export default useStyles
