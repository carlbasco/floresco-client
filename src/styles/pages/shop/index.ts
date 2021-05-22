import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  accordion: {
    borderRadius: '.8em',
    marginBottom: '1.5em',
  },
  accordionSummary: {
    height: '.5em',
    minHeight: '2.5em',
    '&>*': {
      justifyContent: 'center',
    },
  },
  list: {
    width: '100%',
  },
  searchFormControl: {
    marginBottom: '1em',
    // width: '270px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  searchInput: {
    borderRadius: '.7em',
    background: theme.palette.background.paper,
  },
  listItem: {
    margin: '.5em 0',
    '&:hover': {
      borderRadius: '1em',
      color: theme.palette.secondary.main,
      '& div': {
        '& span': {
          fontWeight: 'bolder',
        },
      },
    },
  },
  listItemSelected: {
    color: theme.palette.secondary.main,
    margin: '.5em 0',
    borderRadius: '1em',
    '& div': {
      '& span': {
        fontWeight: 'bolder',
      },
    },
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
  },
  sideBar: {
    width: '20em',
    padding: '1em',
    marginRight: '2em',
  },
  sideBarChapel: {
    width: '20em',
    padding: '1em',
    marginRight: '2em',
  },
  shop: {
    width: '100%',
  },
  mainContent: {
    display: 'flex',
  },
  breadcrumbLink: {
    '&:hover': {
      fontWeight: 'bolder',
      color: theme.palette.secondary.main,
    },
  },
  breadcrumbCart: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    borderRadius: '8px',
    boxShadow: theme.shadows[3],
  },
  divNotFound: {
    marginTop: '20px',
    textAlign: 'center',
  },
  cardAction: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 .5em',
  },
  cardMedia: {
    height: '227px',
  },
  cardContent: {
    padding: '1em 1em 0',
  },
  paperCalendar: {
    width: '20em',
    padding: '1em',
    marginTop: '1em',
    marginRight: '2em',
    marginBottom: '1em',
  },
  calendar: {
    '& button': {
      backgroundColor: theme.palette.text.disabled,
    },
    '& div:nth-child(2)': {
      '& table': {
        width: '100%',
      },
    },

    height: '420px',
    borderRadius: '.5em',
    overflow: 'scroll',
    '&::-webkit-scrollbar, *::-webkit-scrollbar': {
      width: '.3em',
      height: '.3em',
    },
    '&::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
      border: 'none',
      borderRadius: '1em',
      backgroundColor: theme.palette.text.disabled,
    },
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
}))

export default useStyles
