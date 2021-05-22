import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '3em',
      paddingRight: '3em',
    },
  },
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },

  tableHeadCell: {
    fontWeight: 700,
    borderBottom: 0,
  },
  paper: {
    padding: '1em 1em 0',
  },
  noBorderCell: {
    borderBottom: 0,
  },
  btn: {
    margin: '1em 0',
    borderRadius: '.5em',
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  btnDecrement: {
    marginLeft: '.7em',
  },
  btnIncrement: {
    marginRight: '.7em',
  },
  btnCancel: {
    color: theme.palette.text.secondary,
  },
  btnDelete: {
    color: theme.palette.error.main,
  },
  spanSelectItem: {
    color: theme.palette.secondary.main,
  },
  checkout: {
    marginTop: '2.5em',
    [theme.breakpoints.down('sm')]: {
      marginTop: '1em',
    },
  },
  accordion: {
    borderRadius: '.8em',
    marginBottom: '1.5em',
  },
  formControl: {
    marginBottom: '1em',
  },
  link: {
    color: theme.palette.secondary.main,
    cursor: 'pointer',
    display:'block',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

export default useStyles
