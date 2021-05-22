import { makeStyles, Theme } from '@material-ui/core'

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
  calendar: {
    height: '80vh',
    '& button': {
      backgroundColor:theme.palette.text.disabled
    },
    '& div:first-child':{
      color:'black'
    }
  },
  eventTitle: {
    fontWeight: 600,
    fontStyle: 'italic',
  },
  paper: {
    padding: '1.5em',
    [theme.breakpoints.down('sm')]: {
      padding: '1em',
    },
  },
  tableCell: {
    minWidth: '120px',
  },
  tableCellMain: {
    minWidth: '150px',
  },
  btnDelete: {
    color: theme.palette.error.main,
  },
  btnCancel: {
    color: theme.palette.text.secondary,
  },
}))

export default useStyles
