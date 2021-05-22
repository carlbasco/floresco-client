import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import {
  Autocomplete,
  Breadcrumbs,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import {
  LoadingButton,
  LocalizationProvider,
  MobileDatePicker,
} from '@material-ui/lab'

import { iRootState } from '@redux'
import { ClientLayout } from '@layouts'
import {
  CardNumberFormat,
  CardPaymentAnimation,
  CheckOutDialogError,
  ConfirmPaymentDialog,
  pesoFormat,
  RippleLoading,
} from '@components'
import { axiosInstance } from '@lib'
import { paymongoCard } from '@utils'
import useStyles from '@styles/pages/shop/cart/checkout'

const Checkout = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: countryApi } = useSWR('/api/country')
  const [verifyRequest, setVerifyRequest] = useState(false)
  const [checkOutAllow, setCheckOutAllow] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const handlePaymentDialog = () => {
    setOpenPaymentDialog(!openPaymentDialog)
  }

  const [msg, setMsg] = useState('')
  const verifyCheckout = async () => {
    try {
      setVerifyRequest(true)
      const req = await axiosInstance.get('/api/checkout/verify/' + id)
      const res = await req.data
      if (res.allowCheckout) {
        setCheckOutAllow(true)
      } else {
        setMsg(res.msg)
        setCheckOutAllow(false)
        setOpenDialog(true)
      }
    } catch (err) {
      if (err.response.data.msg) {
        setMsg(err.response.data.msg)
      }
      setCheckOutAllow(false)
      setOpenDialog(true)
    } finally {
      setVerifyRequest(false)
    }
  }

  useEffect(() => {
    verifyCheckout()
  }, [countryApi])

  const { data: contractApi } = useSWR(
    checkOutAllow ? '/api/contract/' + id : ''
  )
  const user = useSelector((state: iRootState) => state.auth.user)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setValue('email', user.email)
  }, [])

  const [apiRequest, setApiRequest] = useState(false)
  const onSubmit = async (data: iBillingForm) => {
    paymongoCard(data, setApiRequest, contractApi?.id)
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Checkout</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ClientLayout>
        <Container maxWidth="lg" className={classes.container}>
          <Breadcrumbs separator=">">
            <Link href="/shop">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  className={classes.breadcrumbLink}
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Shop
                </Typography>
              </a>
            </Link>
            <Link href="/shop/cart">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  className={classes.breadcrumbLink}
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Cart
                </Typography>
              </a>
            </Link>
            <Typography variant="subtitle1" fontWeight={600} color="secondary">
              Checkout
            </Typography>
          </Breadcrumbs>
          {verifyRequest ? (
            <RippleLoading />
          ) : checkOutAllow ? (
            <>
              <Typography variant="h6" className={classes.pageSubtitle}>
                Payment Details
              </Typography>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                className={classes.grid}
              >
                <Grid item xs={12} md={6}>
                  <form>
                    <Paper elevation={4} className={classes.paper}>
                      <Typography
                        gutterBottom
                        color="primary"
                        fontWeight={600}
                        textAlign="center"
                        variant="subtitle1"
                      >
                        Billing Information
                      </Typography>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '1em' }}
                      >
                        <InputLabel required> Email </InputLabel>
                        <Controller
                          name="email"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              value={value}
                              labelWidth={60}
                              onChange={(e) => onChange(e.target.value)}
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '1em' }}
                      >
                        <InputLabel required> Phone number </InputLabel>
                        <Controller
                          name="phone"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              value={value}
                              labelWidth={125}
                              onChange={(e) => onChange(e.target.value)}
                            />
                          )}
                        />
                        <FormHelperText error={Boolean(errors.phone)}>
                          {errors.phone?.message}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '1em' }}
                      >
                        <InputLabel required>Address</InputLabel>
                        <Controller
                          name="line1"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              value={value}
                              labelWidth={75}
                              onChange={(e) => onChange(e.target.value)}
                            />
                          )}
                        />
                        <FormHelperText error={Boolean(errors.line1)}>
                          {errors.line1?.message}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '1em' }}
                      >
                        <InputLabel required> City </InputLabel>
                        <Controller
                          defaultValue=""
                          control={control}
                          name="city"
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              value={value}
                              labelWidth={45}
                              onChange={(e) => onChange(e.target.value)}
                            />
                          )}
                        />
                        <FormHelperText error={Boolean(errors.city)}>
                          {errors.city?.message}
                        </FormHelperText>
                      </FormControl>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Controller
                            defaultValue=""
                            control={control}
                            name="country"
                            render={({ field: { onChange } }) => (
                              <>
                                <Autocomplete
                                  disablePortal
                                  options={countryApi}
                                  PaperComponent={customPaper}
                                  getOptionLabel={(item: iCountry) => item.name}
                                  onChange={(_, data) =>
                                    onChange(data?.alpha2Code)
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      required
                                      label="Country"
                                      placeholder="Select a Country"
                                      error={Boolean(errors.country)}
                                      helperText={
                                        Boolean(errors.country) &&
                                        errors.country?.message
                                      }
                                    />
                                  )}
                                />
                              </>
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel required> Postal code </InputLabel>
                            <Controller
                              defaultValue=""
                              control={control}
                              name="postal_code"
                              render={({ field: { value, onChange } }) => (
                                <OutlinedInput
                                  value={value}
                                  labelWidth={105}
                                  onChange={(e) => onChange(e.target.value)}
                                />
                              )}
                            />
                            <FormHelperText error={Boolean(errors.postal_code)}>
                              {errors.postal_code?.message}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Divider sx={{ margin: '1em 0' }}>
                        <Typography
                          gutterBottom
                          fontWeight={600}
                          color="primary"
                          variant="subtitle2"
                        >
                          Debit/Credit Card Information
                        </Typography>
                      </Divider>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '1em',
                        }}
                      >
                        <img
                          src="/visa.png"
                          alt="visa"
                          style={{ height: '30px', marginRight: '1em' }}
                        />
                        <img
                          src="/mastercard.png"
                          alt="mastercard"
                          style={{ height: '50px', marginLeft: '1em' }}
                        />
                      </div>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '1em' }}
                      >
                        <InputLabel required> Name on card</InputLabel>
                        <Controller
                          name="name"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              value={value}
                              labelWidth={115}
                              onChange={(e) => onChange(e.target.value)}
                            />
                          )}
                        />
                        <FormHelperText error={Boolean(errors?.name)}>
                          {errors.name?.message}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '1em' }}
                      >
                        <InputLabel required>Card Number</InputLabel>
                        <Controller
                          name="card_number"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <OutlinedInput
                              value={value}
                              labelWidth={115}
                              inputComponent={CardNumberFormat as any}
                              onChange={(e) => onChange(e.target.value)}
                            />
                          )}
                        />
                        <FormHelperText error={Boolean(errors?.card_number)}>
                          {errors.card_number?.message}
                        </FormHelperText>
                      </FormControl>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Controller
                            name="exp"
                            defaultValue=""
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <MobileDatePicker
                                  value={value}
                                  views={['year', 'month']}
                                  label="Expiration Date"
                                  onChange={(e) => onChange(e)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      required
                                      error={Boolean(errors?.exp)}
                                      helperText={
                                        Boolean(errors?.exp)
                                          ? errors.exp?.message
                                          : 'mm/yyyy'
                                      }
                                      margin="normal"
                                      sx={{ margin: '0' }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: '1em' }}
                          >
                            <InputLabel required> Security Code </InputLabel>
                            <Controller
                              name="cvc"
                              defaultValue=""
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <OutlinedInput
                                  value={value}
                                  labelWidth={120}
                                  onChange={(e) => onChange(e.target.value)}
                                />
                              )}
                            />
                            <FormHelperText error={Boolean(errors?.cvc)}>
                              {errors.cvc?.message}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <LoadingButton
                        fullWidth
                        color="primary"
                        variant="contained"
                        pending={apiRequest}
                        className={classes.btn}
                        onClick={() => handlePaymentDialog()}
                      >
                        Place Order
                      </LoadingButton>
                    </Paper>
                    <ConfirmPaymentDialog
                      open={openPaymentDialog}
                      eventHandler={handlePaymentDialog}
                      actionHandler={handleSubmit(onSubmit)}
                      price={
                        contractApi?.totalPrice &&
                        pesoFormat(contractApi?.totalPrice)
                      }
                    />
                  </form>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Paper elevation={4} className={classes.paper}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight={600}
                      sx={{ marginBottom: '1em' }}
                    >
                      Cart Summary
                    </Typography>
                    {!contractApi ? (
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <CircularProgress />
                      </div>
                    ) : (
                      <div>
                        {contractApi?.PackageCart && (
                          <>
                            <Typography
                              variant="body2"
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
                                    (total: number, val: any) =>
                                      total + val.price,
                                    0
                                  ) -
                                    (contractApi?.PackageCart?.package
                                      ?.discount /
                                      100) *
                                      contractApi?.PackageCart?.package?.Product.reduce(
                                        (total: number, val: any) =>
                                          total + val.price,
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
                                  pesoFormat(
                                    contractApi?.ReservationCart?.price
                                  )}
                              </Typography>
                            </div>
                          </>
                        )}
                        {contractApi?.ProductCart?.length > 0 &&
                          contractApi?.ProductCart?.map(
                            (item: iProductCart) => (
                              <div key={item.id}>
                                <Typography variant="body2" color="secondary">
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
                            )
                          )}

                        <Divider
                          variant="fullWidth"
                          sx={{ margin: '.5em 0' }}
                        />
                        <div className={classes.totalPrice}>
                          <Typography variant="subtitle1" color="secondary">
                            Total Price
                          </Typography>
                          &nbsp; &nbsp; &nbsp;
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="primary"
                          >
                            {contractApi?.totalPrice &&
                              pesoFormat(contractApi?.totalPrice)}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </Paper>
                  <Paper className={classes.paper} elevation={4}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight={600}
                      sx={{ marginBottom: '1em' }}
                    >
                      Contract Summary
                    </Typography>
                    {!contractApi ? (
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <CircularProgress />
                      </div>
                    ) : (
                      <>
                        <Typography variant="subtitle2" color="secondary">
                          Name :
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contractApi?.ContractDetails?.name}
                        </Typography>
                        <Typography variant="subtitle2" color="secondary">
                          Address :
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contractApi?.ContractDetails?.address}
                        </Typography>
                        <Typography variant="subtitle2" color="secondary">
                          Phone Number :
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contractApi?.ContractDetails?.phoneNumber}
                        </Typography>
                        <Typography variant="subtitle2" color="secondary">
                          Deceased :
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contractApi?.ContractDetails?.deceased}
                        </Typography>
                        <Typography variant="subtitle2" color="secondary">
                          Place of Burial :
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contractApi?.ContractDetails?.placeBurial}
                        </Typography>
                      </>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <CheckOutDialogError open={openDialog} msg={msg} />
            </>
          )}
        </Container>
        <CardPaymentAnimation open={apiRequest} />
      </ClientLayout>
    </>
  )
}

const customPaper = (props: any) => {
  return <Paper sx={{ borderRadius: '8px' }} variant="outlined" {...props} />
}
const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email().trim(),
  phone: yup.string().trim().required('Phone number is required'),
  line1: yup.string().trim().required('Address is required'),
  city: yup.string().required('City is required'),
  postal_code: yup
    .number()
    .positive()
    .typeError('Card number is required')
    .required('Postal code is required'),
  country: yup.string().required('Country is required'),
  card_number: yup.string().required('Card number is required'),
  exp: yup.string().required('Expiration date is required'),
  cvc: yup.string().required('Security code is required'),
})

interface iBillingForm {
  name: string
  email: string
  phone: string
  line1: string
  city: string
  postal_code: string
  country: string
  card_number: string
  exp: Date
  cvc: string
}

interface iProductCart {
  id: number
  product: { name: string }
  quantity: number
  price: number
}

interface iCountry {
  name: string
  alpha2Code: string
}

export default Checkout
