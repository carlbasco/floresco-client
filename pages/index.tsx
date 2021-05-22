import { HomeLayout } from '@layouts'
import Head from 'next/head'
import Login from './login'

const index = () => {
  return (
    <>
      {/* <Head>
        <title>Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HomeLayout />
      <h1>Home</h1> */}
      <Login />
    </>
  )
}

export default index
