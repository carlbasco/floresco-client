import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme:Theme) => ({
  typography: {
    margin: '.5em 0!important',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main,
    },
  },
}))

export default useStyles