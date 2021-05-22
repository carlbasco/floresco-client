import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme:Theme) => ({
  div:{
    display:'flex',
    height:'100vh',
    flexDirection:'column'
  },
  toggleTheme: {
    marginLeft:'auto!important'
  },
  container: {
    minHeight: '90vh',
    margin: 'auto',
    padding: '2em 0',
    display: 'flex',
    maxWidth: '460px',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}))

export default useStyles
