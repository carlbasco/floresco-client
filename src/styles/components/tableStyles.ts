import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: '2em',
    width: '100%',
    padding: '1em 1em 0',
  },
  tableContainer: {
    maxHeight: '465px',
  },
  input: {
    borderRadius: '0px',
  },
  tableHeadCell: {
    fontWeight: 700,
  },
  paperHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1em',
  },
  span: {
    display: 'inline-block',
    color: theme.palette.secondary.main,
  },
  btnNew: {
    display: 'inline-flex',
  },
  btnCancel: {
    color: theme.palette.text.secondary,
  },
  btnDelete: {
    color: theme.palette.error.main,
  },
  btnClose: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  btnSubmit: {
    marginTop: '.5em',
    borderRadius: '8px',
  },
  dialog: {
    paddingBottom: '.5em',
  },
  dialogContent: {
    [theme.breakpoints.down('sm')]: {
      padding: '1em 1em',
    },
  },
  formControl: {
    marginBottom: '1em',
  },
  btnDecrement: {
    marginLeft: '.7em',
  },
  btnIncrement: {
    marginRight: '.7em',
  },
}))

export default useStyles
