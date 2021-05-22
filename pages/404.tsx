import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'
import { Lottie } from '@crello/react-lottie'

import animationData from '@lottie/error404Animation.json'

const Custom404 = () => {
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <>
      <Head>
        <title>404 Error Page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div style={style as CSSProperties}>
        <Lottie config={option} width="100" height="100" />
        <Link href="/">
          <Button variant="contained" color="secondary">
            Back to home page
          </Button>
        </Link>
      </div>
    </>
  )
}

export default Custom404
