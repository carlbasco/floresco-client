import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  sliderImgContainer: {
    padding: '1em',
  },
  sliderImg: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
  },
  sliderImgSM: {
    width: '100%',
    height: '100px',
    borderRadius: '8px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
    },
  },
  slider: {
    '& button': {
      '&:before': {
        color: 'black',
      },
    },
  },
  dialogContent: {
    padding: '0em 2em 2em',
  },
  productMain: {
    padding: '4em 2em',
    [theme.breakpoints.down('sm')]: {
      padding: 'unset',
    },
  },
  productMB: {
    marginBottom: '2em',
  },

  skeletonSliderImg: {
    borderRadius: '8px',
    width: '90%',
    height: '400px',
    margin: '1em',
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
  },
  skeletonSliderBottom: {
    display: 'flex',
    flexDirection: 'row',
    margin:'0 1em 0 0',
    justifyContent: 'space-around',
    '& span': {
      width: '200px',
      height: '100px',
      borderRadius: '8px',
      margin:'0 1em',
      [theme.breakpoints.down('sm')]: {
        height: '50px',
        width:'100px'
      },
    },
  },
}))

export default useStyles
