import Head from 'next/head'
import Link from 'next/link'
import { Breadcrumbs, Container, Typography } from '@material-ui/core'

import { TableAccount } from '@components'
import { AdminLayout } from '@layouts'
import useStyles from '@styles/pages/accounts'

const Accounts = () => {
  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Accounts - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout index={4}>
        <div>
          <Breadcrumbs separator=">">
            <Link href="/admin">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  className={classes.breadcrumbLink}
                  color="textPrimary"
                  variant="body1"
                >
                  Dashboard
                </Typography>
              </a>
            </Link>
            <Typography color="textSecondary" variant="body1">
              Accounts
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="primary" fontWeight="600">
            Account List
          </Typography>
        </div>
        <Container maxWidth="xl" className={classes.container}>
          <TableAccount />
        </Container>
      </AdminLayout>
    </>
  )
}

export default Accounts
