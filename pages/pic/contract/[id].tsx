import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import moment from 'moment'
import {
  Paper,
  Typography,
  Container,
  Breadcrumbs,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'

import ErrorPage from '../../404'
import { ContractDialog, pesoFormat, SpanBadge } from '@components'
import { PicLayout } from '@layouts'
import { fetcher } from '@lib'
import useStyles from '@styles/pages/contracts'

const Contract = ({ contract, error }: iProps) => {
  const router = useRouter()
  const { id } = router.query
  if (error === true) return <ErrorPage />
  const { data: contractApi } = useSWR('/api/contract/' + id, {
    initialData: contract,
  })

  const [openContractDialog, setOpenContractDialog] = useState(false)
  const handleContractDialog = () => {
    setOpenContractDialog(!openContractDialog)
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Contract</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PicLayout>
        <Container maxWidth="lg">
          <div>
            <Breadcrumbs separator=">">
              <Link href="/pic">
                <a style={{ textDecoration: 'none' }}>
                  <Typography
                    className={classes.breadcrumbLink}
                    color="textPrimary"
                    variant="body1"
                  >
                    Contract List
                  </Typography>
                </a>
              </Link>
              <Typography color="textSecondary" variant="body1">
                Contract
              </Typography>
            </Breadcrumbs>
          </div>
        </Container>
        <Container maxWidth="md">
          <Paper elevation={17} className={classes.paper}>
            <div className={classes.paperHeader}>
              <Typography variant="subtitle1" color="primary" fontWeight="600">
                Contract #{id}
              </Typography>
              <Tooltip title="Edit Contract">
                <IconButton color="primary" onClick={handleContractDialog}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </div>
            <Divider variant="middle" sx={{ marginBottom: '1em' }}>
              <Typography variant="subtitle1" color="primary" fontWeight={600}>
                Contract Summary
              </Typography>
            </Divider>
            <Grid container>
              <Grid item xs={12} md={6} justifyItems="center">
                <Typography
                  display="inline"
                  fontWeight={600}
                  color="secondary"
                  variant="subtitle2"
                >
                  Contract Status :&nbsp;&nbsp;&nbsp;
                </Typography>
                <SpanBadge
                  label={contractApi?.status}
                  variant={
                    contractApi?.status === 'pending'
                      ? 'warning'
                      : contractApi?.status === 'completed'
                      ? 'success'
                      : contractApi?.status === 'ongoing'
                      ? 'info'
                      : 'error'
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  display="inline"
                  fontWeight={600}
                  color="secondary"
                  variant="subtitle2"
                >
                  Payment Status :&nbsp;&nbsp;&nbsp;
                </Typography>
                <SpanBadge
                  label={contractApi?.paymentStatus}
                  variant={
                    contractApi.paymentStatus === 'pending'
                      ? 'warning'
                      : contractApi.paymentStatus === 'paid'
                      ? 'success'
                      : contractApi.paymentStatus === 'processing'
                      ? 'info'
                      : 'error'
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontWeight={600}
                  color="secondary"
                  variant="subtitle2"
                >
                  Name :
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {contractApi?.ContractDetails?.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontWeight={600}
                  color="secondary"
                  variant="subtitle2"
                >
                  Phone Number :
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {contractApi?.ContractDetails?.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontWeight={600}
                  variant="subtitle2"
                  color="secondary"
                >
                  Address :
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {contractApi?.ContractDetails?.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontWeight={600}
                  color="secondary"
                  variant="subtitle2"
                >
                  Deceased :
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {contractApi?.ContractDetails?.deceased}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontWeight={600}
                  color="secondary"
                  variant="subtitle2"
                >
                  Place of Burial :
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {contractApi?.ContractDetails?.placeBurial}
                </Typography>
              </Grid>
            </Grid>
            <Divider variant="middle" sx={{ margin: '1em 0' }}>
              <Typography variant="subtitle1" color="primary" fontWeight={600}>
                Cart Ordered Summary
              </Typography>
            </Divider>
            <div>
              {contractApi?.PackageCart && (
                <>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="secondary"
                    sx={{ marginTop: '.5em' }}
                  >
                    Package
                  </Typography>
                  <div className={classes.cartItems}>
                    <Typography variant="body1">
                      {contractApi?.PackageCart?.package?.name}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {pesoFormat(
                        contractApi?.PackageCart?.package?.Product.reduce(
                          (total: number, val: any) => total + val.price,
                          0
                        ) -
                          (contractApi?.PackageCart?.package?.discount / 100) *
                            contractApi?.PackageCart?.package?.Product.reduce(
                              (total: number, val: any) => total + val.price,
                              0
                            )
                      )}
                    </Typography>
                  </div>
                </>
              )}
              {contractApi?.ReservationCart && (
                <>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="secondary"
                    sx={{ marginTop: '.5em' }}
                  >
                    Reservation
                  </Typography>
                  <div className={classes.cartItems}>
                    <div>
                      <Typography variant="body1">
                        {contractApi?.ReservationCart?.chapel?.name}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        sx={{ fontSize: '12px' }}
                      >
                        {`From ${moment(
                          contractApi?.ReservationCart?.startDate
                        ).format('LL')} to ${moment(
                          contractApi?.ReservationCart?.endDate
                        ).format('LL')}`}
                      </Typography>
                    </div>
                    <Typography variant="body1" fontWeight={600}>
                      {contractApi?.ReservationCart?.price &&
                        pesoFormat(contractApi?.ReservationCart?.price)}
                    </Typography>
                  </div>
                </>
              )}
              {contractApi?.ProductCart?.length > 0 &&
                contractApi?.ProductCart?.map((item: any) => (
                  <div key={item.id}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="secondary"
                    >
                      Products/ Services
                    </Typography>
                    <div className={classes.cartItems}>
                      <Typography variant="body1">
                        {item?.quantity}&nbsp;x&nbsp;
                        {item?.product?.name}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {item?.price && pesoFormat(item?.price)}
                      </Typography>
                    </div>
                  </div>
                ))}

              <Divider variant="fullWidth" sx={{ margin: '.5em 0' }} />
              <div className={classes.totalPrice}>
                <Typography
                  color="secondary"
                  fontWeight={600}
                  variant="subtitle1"
                >
                  Total Price
                </Typography>
                &nbsp; &nbsp; &nbsp;
                <Typography variant="body1" fontWeight={600} color="primary">
                  {contractApi?.totalPrice &&
                    pesoFormat(contractApi?.totalPrice)}
                </Typography>
              </div>
            </div>
          </Paper>
          <ContractDialog
            open={openContractDialog}
            contract={contractApi}
            eventHandler={handleContractDialog}
          />
        </Container>
      </PicLayout>
    </>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id
  try {
    const contract = await fetcher('/api/contract/' + id)
    const error = false
    return { props: { contract, error } }
  } catch (err) {
    const contract = null
    const error = true
    return { props: { contract, error } }
  }
}

interface iProps {
  contract: any
  error: boolean
}

export default Contract
