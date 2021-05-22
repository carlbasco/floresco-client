import { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { Router, useRouter } from 'next/dist/client/router'
import { useSelector } from 'react-redux'
import { SnackbarOrigin, SnackbarProvider } from 'notistack'
import { CssBaseline } from '@material-ui/core'
import { SWRConfig } from 'swr'
import Cookies from 'cookie'

import { SnackbarConfig, ssrFetchAccessToken, swrConfig } from '@lib'
import { wrapper, loadAuth, NO_USER, iRootState } from '@redux'
import { Loading, AppWrapper } from '@components'
import PageNotFound from '@pages/404'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Head from 'next/head'

const isServer = () => typeof window === 'undefined'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true))
    Router.events.on('routeChangeComplete', () => setLoading(false))
    Router.events.on('routeChangeError', () => setLoading(false))
    return () => {
      Router.events.off('routeChangeStart', () => setLoading(true))
      Router.events.off('routeChangeComplete', () => setLoading(false))
      Router.events.off('routeChangeError', () => setLoading(false))
    }
  }, [Router])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  const anchorOrigin: SnackbarOrigin = {
    vertical: 'top',
    horizontal: 'left',
  }

  const router = useRouter()
  const auth = useSelector((state: iRootState) => state.auth)
  const { user, isAuthenticated } = auth
  let allowed = true

  useEffect(() => {
    if (!isAuthenticated) {
      if (router.pathname.startsWith('/admin' || '/shop' || '/pic'))
        router.replace('/login')
    }
  }, [isAuthenticated])

  if (router.pathname.startsWith('/admin') && user.role !== 'admin') {
    allowed = false
  }
  if (router.pathname.startsWith('/shop') && user.role !== 'client') {
    allowed = false
  }
  if (router.pathname.startsWith('/pic') && user.role !== 'pic') {
    allowed = false
  }

  const ComponentToRender = allowed ? Component : PageNotFound

  return (
    <>
      <Head>
        <title>Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SWRConfig value={swrConfig}>
        <AppWrapper>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} anchorOrigin={anchorOrigin}>
            <SnackbarConfig />
            {loading ? <Loading /> : <ComponentToRender {...pageProps} />}
          </SnackbarProvider>
        </AppWrapper>
      </SWRConfig>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }: any) => {
  if (isServer()) {
    const { req, store } = ctx
    if (req.headers.cookie) {
      const cookie = Cookies.parse(req.headers.cookie)
      // console.log('load user from initialprops')
      if (cookie.rtid) {
        await ssrFetchAccessToken(cookie.rtid)
        await store.dispatch(loadAuth())
      } else {
        await ctx.store.dispatch({ type: NO_USER })
      }
    } else {
      await ctx.store.dispatch({ type: NO_USER })
    }
  }

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}
  return { pageProps }
}

export default wrapper.withRedux(MyApp)
