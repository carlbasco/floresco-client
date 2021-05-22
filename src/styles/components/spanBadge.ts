import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      fontWeight: 700,
      height: '1.5em',
      minWidth: '1.5em',
      fontSize: '.75em',
      padding: '0 .5em',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      color: theme.palette.success.dark,
      backgroundColor: theme.palette.success.light,
    },
    warning: {
      fontWeight: 700,
      height: '1.5em',
      minWidth: '1.5em',
      fontSize: '.75em',
      padding: '0 .5em',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      color: theme.palette.warning.dark,
      backgroundColor: theme.palette.warning.light,
    },
    error: {
      fontWeight: 700,
      height: '1.5em',
      minWidth: '1.5em',
      fontSize: '.75em',
      padding: '0 .5em',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      color: theme.palette.error.dark,
      backgroundColor: theme.palette.error.light,
    },
    info: {
      fontWeight: 700,
      height: '1.5em',
      minWidth: '1.5em',
      fontSize: '.75em',
      padding: '0 .5em',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      color: theme.palette.info.dark,
      backgroundColor: theme.palette.info.light,
    },
  })
)

export default useStyles
