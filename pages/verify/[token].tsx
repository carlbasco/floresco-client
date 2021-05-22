import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { Alert, AlertProps, AlertTitle, Typography } from '@material-ui/core'

import { AuthLayout } from '@layouts'
import { Loading } from '@components'
import { iRootState } from '@redux'
import { axios } from '@lib'
import useStyle from '@styles/pages/verify'

const isServer = () => typeof window === 'undefined'

const Token = () => {
  const [fetchRequest, setFetchRequest] = useState(false)
  const [message, setMessage] = useState('')
  const [alertType, setAlertType] = useState<AlertProps['severity']>()
  const router = useRouter()
  const { token } = router.query

  const fetchApi = async () => {
    setFetchRequest(true)
    try {
      const res = await axios.post(`/api/auth/verify/${token}`)
      if (res.status === 200) {
        setAlertType('success')
        setMessage(res.data.msg)
      }
    } catch (err) {
      setAlertType('error')
      setMessage(err.response.data.msg)
    } finally {
      setFetchRequest(false)
    }
  }

  useEffect(() => {
    fetchApi()
  }, [token])

  const auth = useSelector((state: iRootState) => state.auth)
  if (!isServer()) {
    if (auth.isAuthenticated) {
      if (auth.user.role === 'admin') router.replace('/admin')
      if (auth.user.role === 'pic') router.replace('/pic')
      if (auth.user.role === 'client') router.replace('/shop')
    }
  }

  const classes = useStyle()
  return (
    <>
      <Head>
        <title>Link Verification - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {fetchRequest ? (
        <Loading />
      ) : message !== '' ? (
        <>
          <AuthLayout>
            <Alert severity={alertType} variant="outlined">
              <AlertTitle>
                {alertType === 'success' ? 'Success' : 'Error'}
              </AlertTitle>
              {message}
            </Alert>
            <Typography align="center" className={classes.typography}>
              Go back to &nbsp;
              <Link href="/login">
                <a className={classes.link}>Login</a>
              </Link>
            </Typography>
          </AuthLayout>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default Token
