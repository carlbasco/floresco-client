import animationData from '@lottie/cardAnimation.json'
import { Lottie } from '@crello/react-lottie'
import { Backdrop, makeStyles, Theme, Typography } from '@material-ui/core'

const CardPaymentAnimation = ({ open }: iProps) => {
  const option = {
    loop: true,
    autoplay: true,
    animationData,
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
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            color="primary"
            fontWeight={600}
          >
            Processing your payment...
          </Typography>
          <Typography variant="body2" align="center" fontWeight={600}>
            Please do not close your browser
          </Typography>
        </div>
      </Backdrop>
    </>
  )
}

interface iProps {
  open: boolean
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '270px',
    height: '270px',
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
  lottie: {
    height: '100%',
    width: '100%',
  },
}))

export default CardPaymentAnimation
