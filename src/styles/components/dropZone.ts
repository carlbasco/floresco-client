import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  mainContainer: {
    borderRadius: '8px',
    padding: '1em .5em',
    border: '1px solid',
    borderColor: theme.palette.action.disabled,
    marginBottom: '1em',
  },
  dropzone: {
    display: 'inline-grid',
    margin: '.5em',
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'center',
    flexWrap: 'wrap',
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid',
    borderColor: theme.palette.action.disabled,
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%',
  },
  paragraph: {
    color: theme.palette.text.disabled,
    textAlign: 'center',
  },
  box: {
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
    },
  },
  btnRemove: {
    borderRadius: '5px',
    backgroundColor: 'unset',
    cursor:'pointer',
    borderColor:theme.palette.error.dark,
    color:theme.palette.error.dark,
    border:'.5px solid',
    '&:focus': {
      outline: 'none',
    },
  },
}))

export default useStyles
