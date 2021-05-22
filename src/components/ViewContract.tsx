import { useState } from 'react'
import useSWR, { trigger } from 'swr'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { Close } from '@material-ui/icons'

import { pesoFormat } from '@components'
import moment from 'moment'
import SpanBadge from './SpanBadge'
import { axiosInstance, Snackbar } from '@lib'
import useStyles from '@styles/components/viewContract'

const ViewContract = (props: iProps) => {
  const { data: contractApi } = useSWR(
    props.open ? '/api/contract/' + props.id : ''
  )

  const [cancelDialog, setCancelDialog] = useState(false)
  const handleCancelDialog = () => {
    setCancelDialog(!cancelDialog)
  }
  const [apiRequest, setApiRequest] = useState(false)

  const cancelContract = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.put('/api/contract/cancel/' + props.id)
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/contract/' + props.id)
      trigger('/api/user/contract/list')
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
      handleCancelDialog()
    }
  }

  const classes = useStyles()
  return (
    <>
      <Dialog
        maxWidth="sm"
        open={props.open}
        onClose={props.eventHandler}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <DialogTitle>
          View Contract
          <IconButton onClick={props.eventHandler} className={classes.btnClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Divider variant="middle" sx={{ marginBottom: '1em' }}>
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              Contract Summary
            </Typography>
          </Divider>
          {!contractApi ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                minWidth: '275px',
                margin: '2em, 1em',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
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
            </>
          )}
          <Divider variant="middle" sx={{ margin: '1em 0' }}>
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              Cart Ordered Summary
            </Typography>
          </Divider>
          {!contractApi ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '2em, 1em',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
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
                contractApi?.ProductCart?.map((item: iProductCart) => (
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
          )}
          {contractApi?.status === 'pending' && (
            <>
              <Divider variant="fullWidth" sx={{ margin: '1.5em 0' }} />
              <DialogActions>
                <Button
                  sx={{ color: 'error.main' }}
                  onClick={handleCancelDialog}
                >
                  Cancel Contract
                </Button>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={cancelDialog}
        onClose={handleCancelDialog}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <DialogTitle>Cancel Contract?</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText>
            Are you sure you want to cancel Contract #{contractApi?.id} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={apiRequest}
            onClick={handleCancelDialog}
            sx={{ color: 'text.secondary' }}
          >
            Close
          </Button>
          <LoadingButton pending={apiRequest} onClick={cancelContract}>
            Cancel Contract
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ViewContract

interface iProps {
  open: boolean
  eventHandler: () => void
  id: string
}

interface iProductCart {
  id: number
  product: { name: string }
  quantity: number
  price: number
}
