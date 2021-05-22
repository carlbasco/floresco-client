import animationData from '@lottie/loadingAnimation.json'
import { Lottie } from '@crello/react-lottie'

const Loading = () => {
  const option = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const style = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div style={style}>
      <Lottie config={option} height="500" width="500" />
    </div>
  )
}

export default Loading
