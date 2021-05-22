import cloudSync from '@lottie/cloudSync.json'
import cloudDownload from '@lottie/cloudDownload.json'
import cloudUpload from '@lottie/cloudUpload.json'
import { Lottie } from '@crello/react-lottie'
import { Backdrop, makeStyles, Theme } from '@material-ui/core'

const CloudLoadingAnimation = ({ open, animation }: iProps) => {
  const option = {
    loop: true,
    autoplay: true,
    animationData:
      animation === 'download'
        ? cloudDownload
        : animation === 'upload'
        ? cloudUpload
        : cloudSync,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const classes = useStyles()
  return (
    <>
      <Backdrop className={classes.backdrop} open={open}>
        <div className={classes.root}>
          <Lottie
            playingState={open ? 'playing' : 'stopped'}
            className={classes.lottie}
            config={option}
          />
        </div>
      </Backdrop>
    </>
  )
}

interface iProps {
  open: boolean
  animation: 'sync' | 'upload' | 'download'
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '550px',
    height: '550px',
  },
  backdrop: {
    zIndex: theme.zIndex.modal+1,
  },
  lottie: {
    height: '100%',
    width: '100%',
  },
}))

export default CloudLoadingAnimation
