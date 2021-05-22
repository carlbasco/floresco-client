import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useSWR, { trigger } from 'swr'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import moment from 'moment'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { AddCircle, Delete, ExpandMore, RemoveCircle } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'

import { pesoFormat, PhoneNumberFormat, TermsPolicy } from '@components'
import { ClientLayout } from '@layouts'
import { axiosInstance, Snackbar } from '@lib'
import { iRootState } from '@redux'
import useStyles from '@styles/pages/shop/cart'

const Cart = () => {
  const { data: contractApi } = useSWR('/api/contract')
  const { data: cartCountApi } = useSWR('/api/cart/count')

  const user = useSelector((state: iRootState) => state.auth.user)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const calculate = () => {
    setTotal(0)
    if (contractApi) {
      let temp = 0
      if (contractApi?.ProductCart.length > 0) {
        temp = contractApi?.ProductCart?.reduce(
          (total: number, val: any) => total + val.price * val.quantity,
          0
        )
      }
      if (contractApi?.ReservationCart) {
        temp = temp + contractApi?.ReservationCart.price
      }

      if (contractApi?.PackageCart) {
        temp =
          temp +
          contractApi?.PackageCart?.package?.Product.reduce(
            (total: number, val: any) => total + val.price,
            0
          ) -
          (contractApi?.PackageCart?.package?.discount / 100) *
            contractApi?.PackageCart?.package?.Product.reduce(
              (total: number, val: any) => total + val.price,
              0
            )
      }
      setTotal(temp)
    }
  }

  const [total, setTotal] = useState(0)
  useEffect(() => {
    if (contractApi) {
      const { ContractDetails } = contractApi
      setValue('name', `${user.lastName}, ${user.firstName} ${user.middleName}`)
      setValue(
        'address',
        !ContractDetails?.address ? '' : ContractDetails?.address
      )
      setValue(
        'deceased',
        !ContractDetails?.deceased ? '' : ContractDetails?.deceased
      )
      setValue(
        'phoneNumber',
        !ContractDetails?.phoneNumber ? '' : ContractDetails?.phoneNumber
      )
      setValue(
        'placeBurial',
        !ContractDetails?.placeBurial ? '' : ContractDetails?.placeBurial
      )
    }
    calculate()
  }, [contractApi])

  const triggerApi = () => {
    trigger('/api/contract')
    trigger('/api/cart/count')
    calculate()
  }

  const [apiRequest, setApiRequest] = useState(false)
  const [apiCheckoutRequest, setApiCheckoutRequest] = useState(false)
  const [cartValues, setCartValues] = useState<any>([])
  useEffect(() => {
    if (contractApi?.ProductCart) {
      setCartValues(contractApi?.ProductCart)
    }
  }, [contractApi])

  const incrementQty = (index: any) => {
    let newCartValues = [...cartValues]
    newCartValues[index].quantity = cartValues[index].quantity + 1
    setCartValues(newCartValues)
  }
  const decrementQty = (index: any) => {
    let newCartValues = [...cartValues]
    if (newCartValues[index].quantity <= 1) {
      newCartValues[index].quantity = 1
    } else {
      newCartValues[index].quantity = cartValues[index].quantity - 1
    }
    setCartValues(newCartValues)
  }

  const [openProductDialog, setOpenProductDialog] = useState(false)
  const handleProductDialog = () => {
    setOpenProductDialog(!openProductDialog)
  }
  const [selectedValue, setSelectedValue] = useState({
    name: '',
    id: 0,
  })
  const handleDelete = (id: number, name: string) => {
    setSelectedValue({ ...selectedValue, id, name })
    handleProductDialog()
  }
  const deleteProductCart = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete(
        '/api/cart/product/' + selectedValue.id
      )
      const res = await req.data
      triggerApi()
      Snackbar.success(res.msg)
      setApiRequest(false)
      handleProductDialog()
    } catch (err) {
      setApiRequest(false)
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    }
  }

  const updateCartItem = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.put('/api/orderitems', cartValues)
      const res = await req.data
      triggerApi()
      Snackbar.info(res.msg)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const [openChapelDialog, setOpenChapelDialog] = useState(false)
  const handleChapelDialog = () => {
    setOpenChapelDialog(!openChapelDialog)
  }
  const deleteChapelCart = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete(
        '/api/cart/reservation/' + contractApi?.ReservationCart?.id
      )
      const res = await req.data
      triggerApi()
      Snackbar.success(res.msg)
      handleChapelDialog()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const [openPackageDialog, setOpenPackageDialog] = useState(false)
  const handlePackageDialog = () => {
    setOpenPackageDialog(!openPackageDialog)
  }
  const deletePackageCart = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete(
        '/api/cart/package/' + contractApi?.PackageCart?.id
      )
      const res = await req.data
      triggerApi()
      Snackbar.success(res.msg)
      handlePackageDialog()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const onSubmit = async (data: iContract) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.put(
        '/api/contract/' + contractApi?.id,
        data
      )
      const res = await req.data
      Snackbar.success(res.msg)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const router = useRouter()
  const handleCheckOut = async () => {
    try {
      setApiCheckoutRequest(true)
      await axiosInstance.post('/api/contract/' + contractApi?.id)
      router.push('/shop/cart/checkout/' + contractApi?.id)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiCheckoutRequest(false)
    }
  }

  const [openTermDialog, setOpenTermDialog] = useState(false)
  const handleTermDialog = () => {
    setOpenTermDialog(!openTermDialog)
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Cart</title>
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
            <Typography variant="subtitle1" fontWeight={600} color="secondary">
              Cart
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" className={classes.checkout}>
            Cart
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={17}
                className={classes.paper}
                sx={{ marginTop: '1em' }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  marginBottom={2}
                >
                  Cart ({cartCountApi ? cartCountApi : 0})
                  {cartCountApi > 1 ? ' items' : ' item'}
                </Typography>
                {cartCountApi === undefined ? (
                  <>
                    <TableContainer>
                      <Table stickyHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              align="center"
                              className={classes.noBorderCell}
                            >
                              <CircularProgress />
                              <Typography variant="subtitle2">
                                Loading
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : cartCountApi <= 0 ? (
                  <>
                    <TableContainer>
                      <Table stickyHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              align="center"
                              colSpan={4}
                              className={classes.noBorderCell}
                            >
                              <Typography variant="subtitle1">
                                Your Cart is empty
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.noBorderCell} />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <>
                    {contractApi?.PackageCart && (
                      <TableContainer sx={{ marginTop: '1em' }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableHeadCell}>
                                Package
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableHeadCell}
                              >
                                Package Price
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableHeadCell}
                              >
                                Discount Rate
                              </TableCell>
                              <TableCell
                                align="center"
                                colSpan={2}
                                className={classes.tableHeadCell}
                              >
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                className={classes.noBorderCell}
                                sx={{ minWidth: '150px' }}
                              >
                                {contractApi?.PackageCart?.package?.name}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.noBorderCell}
                                sx={{ minWidth: '120px' }}
                              >
                                {pesoFormat(
                                  contractApi?.PackageCart?.package?.Product.reduce(
                                    (total: number, val: any) =>
                                      total + val.price,
                                    0
                                  )
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.noBorderCell}
                              >
                                {contractApi?.PackageCart.package.discount}%
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.noBorderCell}
                                sx={{ minWidth: '120px' }}
                              >
                                {contractApi?.PackageCart?.package?.Product &&
                                  pesoFormat(
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
                              </TableCell>
                              <TableCell
                                className={classes.noBorderCell}
                                sx={{ minWidth: '3.2em' }}
                              >
                                <Tooltip title="remove package from cart">
                                  <IconButton
                                    disabled={apiCheckoutRequest}
                                    onClick={handlePackageDialog}
                                  >
                                    <Delete color="error" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    {contractApi?.ReservationCart && (
                      <TableContainer sx={{ marginTop: '1em' }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              {chapelHead.map((item) => (
                                <TableCell
                                  key={item.label}
                                  align={item.align}
                                  className={classes.tableHeadCell}
                                >
                                  {item.label}
                                </TableCell>
                              ))}
                              <TableCell
                                colSpan={2}
                                align="center"
                                sx={{ fontWeight: 700, minWidth: '120px' }}
                                className={classes.noBorderCell}
                              >
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                sx={{ minWidth: '150px', fontWeight: 600 }}
                                className={classes.noBorderCell}
                              >
                                {contractApi?.ReservationCart?.chapel.name}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ minWidth: '120px' }}
                                className={classes.noBorderCell}
                              >
                                {contractApi?.ReservationCart?.chapel?.price &&
                                  pesoFormat(
                                    contractApi?.ReservationCart?.chapel?.price
                                  )}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ minWidth: '170px' }}
                                className={classes.noBorderCell}
                              >
                                {moment(
                                  contractApi?.ReservationCart?.startDate
                                ).format('LL')}
                                <div>&nbsp;to&nbsp;</div>
                                {moment(
                                  contractApi?.ReservationCart?.endDate
                                ).format('LL')}
                              </TableCell>

                              <TableCell
                                className={classes.noBorderCell}
                                align="center"
                                sx={{ minWidth: '120px' }}
                              >
                                {contractApi?.ReservationCart?.price &&
                                  pesoFormat(
                                    contractApi?.ReservationCart?.price
                                  )}
                              </TableCell>
                              <TableCell
                                className={classes.noBorderCell}
                                sx={{ minWidth: '3.2em' }}
                              >
                                <Tooltip title="remove chapel from cart">
                                  <IconButton
                                    disabled={apiCheckoutRequest}
                                    onClick={handleChapelDialog}
                                  >
                                    <Delete color="error" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    {contractApi?.ProductCart.length > 0 && (
                      <TableContainer>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              {productHead.map((item) => (
                                <TableCell
                                  key={item.label}
                                  align={item.align}
                                  className={classes.tableHeadCell}
                                >
                                  {item.label}
                                </TableCell>
                              ))}
                              <TableCell
                                colSpan={2}
                                align="center"
                                sx={{ fontWeight: 700 }}
                                className={classes.noBorderCell}
                              >
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cartValues?.map(
                              (item: iTableRowCell, index: number) => (
                                <TableRow key={item.id}>
                                  <TableCell
                                    className={classes.noBorderCell}
                                    sx={{ minWidth: '150px' }}
                                  >
                                    {item?.product.name}
                                  </TableCell>
                                  <TableCell
                                    className={classes.noBorderCell}
                                    align="center"
                                    sx={{ minWidth: '120px' }}
                                  >
                                    {item?.price && pesoFormat(item?.price)}
                                  </TableCell>
                                  <TableCell
                                    className={classes.noBorderCell}
                                    align="center"
                                    sx={{
                                      width: '170px',
                                      minWidth: '170px',
                                    }}
                                  >
                                    <Tooltip title="subtract quantity">
                                      <IconButton
                                        disabled={apiCheckoutRequest}
                                        className={classes.btnDecrement}
                                        onClick={() => decrementQty(index)}
                                      >
                                        <RemoveCircle color="secondary" />
                                      </IconButton>
                                    </Tooltip>
                                    {item?.quantity}
                                    <Tooltip title="add quantity">
                                      <IconButton
                                        disabled={apiCheckoutRequest}
                                        className={classes.btnIncrement}
                                        onClick={() => incrementQty(index)}
                                      >
                                        <AddCircle color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell
                                    className={classes.noBorderCell}
                                    align="right"
                                    sx={{ minWidth: '120px' }}
                                  >
                                    {item?.price &&
                                      pesoFormat(item?.price * item?.quantity)}
                                  </TableCell>
                                  <TableCell
                                    className={classes.noBorderCell}
                                    sx={{ minWidth: '3.2em' }}
                                  >
                                    <Tooltip title="remove product from cart">
                                      <IconButton
                                        disabled={apiCheckoutRequest}
                                        onClick={() =>
                                          handleDelete(
                                            item?.id,
                                            item?.product.name
                                          )
                                        }
                                      >
                                        <Delete color="error" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                align="right"
                                className={classes.noBorderCell}
                              >
                                <LoadingButton
                                  type="submit"
                                  color="primary"
                                  variant="contained"
                                  pending={apiRequest}
                                  onClick={updateCartItem}
                                  disabled={apiCheckoutRequest}
                                >
                                  Update Products
                                </LoadingButton>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4} style={{ paddingTop: '2em' }}>
              {cartCountApi > 0 && (
                <Accordion
                  elevation={17}
                  defaultExpanded
                  className={classes.accordion}
                  TransitionProps={{ unmountOnExit: true }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Contract Form
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {!contractApi ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <CircularProgress />
                        <Typography variant="subtitle2">Loading</Typography>
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: 'inline-flex',
                            marginBottom: '1em',
                          }}
                        >
                          <Typography variant="subtitle2" color="secondary">
                            Contract ID:
                          </Typography>
                          <Typography variant="body2">
                            {contractApi?.id}
                          </Typography>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel> Name </InputLabel>
                            <Controller
                              name="name"
                              defaultValue=""
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <OutlinedInput
                                  disabled
                                  value={value}
                                  labelWidth={45}
                                  onChange={(e) => onChange(e.target.value)}
                                />
                              )}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel required> Address </InputLabel>
                            <Controller
                              name="address"
                              defaultValue=""
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <OutlinedInput
                                    rows={3}
                                    multiline
                                    value={value}
                                    labelWidth={75}
                                    onChange={(e) => onChange(e.target.value)}
                                  />
                                  <FormHelperText
                                    error={Boolean(errors.address)}
                                  >
                                    {errors.address?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel required> Contact Number </InputLabel>
                            <Controller
                              name="phoneNumber"
                              defaultValue=""
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <OutlinedInput
                                    value={value}
                                    labelWidth={140}
                                    onChange={(e) => onChange(e.target.value)}
                                    inputComponent={PhoneNumberFormat as any}
                                  />
                                  <FormHelperText
                                    error={Boolean(errors.phoneNumber)}
                                  >
                                    {errors.phoneNumber?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel required> Deceased Name </InputLabel>
                            <Controller
                              name="deceased"
                              defaultValue=""
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <OutlinedInput
                                    value={value}
                                    labelWidth={140}
                                    onChange={(e) => onChange(e.target.value)}
                                  />
                                  <FormHelperText
                                    error={Boolean(errors.deceased)}
                                  >
                                    {errors.deceased?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel required> Place Burial </InputLabel>
                            <Controller
                              name="placeBurial"
                              defaultValue=""
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <OutlinedInput
                                    rows={3}
                                    multiline
                                    value={value}
                                    labelWidth={105}
                                    onChange={(e) => onChange(e.target.value)}
                                  />
                                  <FormHelperText
                                    error={Boolean(errors.placeBurial)}
                                  >
                                    {errors.placeBurial?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </FormControl>
                          <LoadingButton
                            fullWidth
                            type="submit"
                            color="primary"
                            variant="contained"
                            pending={apiRequest}
                            disabled={apiCheckoutRequest}
                          >
                            Update Contract
                          </LoadingButton>
                        </form>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}
              <Paper
                elevation={17}
                className={classes.paper}
                sx={{ marginBottom: '2em' }}
              >
                <Table>
                  <TableBody>
                    {cartCountApi > 0 ? (
                      <TableRow>
                        <TableCell className={classes.noBorderCell}>
                          <Typography variant="body1" fontWeight={600}>
                            Total Price
                          </Typography>
                        </TableCell>
                        <TableCell
                          className={classes.noBorderCell}
                          align="right"
                        >
                          <Typography
                            variant="body1"
                            color="primary"
                            fontWeight={600}
                          >
                            {total > 0 && pesoFormat(total)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          No Data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Divider variant="middle" />
                <FormHelperText
                  sx={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginBottom: '1em',
                  }}
                >
                  Please make sure to update Contract Form and update the Cart
                  items after changing it before proceeding to checkout
                </FormHelperText>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  fontSize=".8em"
                >
                  By clicking Check Out, you agree to our Contract&nbsp;
                  <a onClick={handleTermDialog} className={classes.link}>
                    Terms and Condition
                  </a>
                </Typography>
                <LoadingButton
                  fullWidth
                  disabled={cartCountApi > 0 ? false : true}
                  variant="contained"
                  className={classes.btn}
                  onClick={handleCheckOut}
                  pending={apiCheckoutRequest}
                >
                  Check Out
                </LoadingButton>
              </Paper>
            </Grid>
          </Grid>

          <Dialog open={openProductDialog} onClose={handleProductDialog}>
            <DialogTitle>Delete Product Cart item?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to remove
                <span className={classes.spanSelectItem}>
                  &nbsp;{selectedValue.name}&nbsp;
                </span>
                from your cart?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={apiRequest}
                className={classes.btnCancel}
                onClick={handleProductDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                className={classes.btnDelete}
                onClick={deleteProductCart}
                autoFocus
                pending={apiRequest}
              >
                Remove
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <Dialog open={openChapelDialog} onClose={handleChapelDialog}>
            <DialogTitle>Delete Reservation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to remove this reservation from your cart?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={apiRequest}
                className={classes.btnCancel}
                onClick={handleChapelDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                className={classes.btnDelete}
                onClick={deleteChapelCart}
                autoFocus
                pending={apiRequest}
              >
                Remove
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <Dialog open={openPackageDialog} onClose={handleProductDialog}>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to remove this Package from your cart?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={apiRequest}
                className={classes.btnCancel}
                onClick={handlePackageDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                className={classes.btnDelete}
                onClick={deletePackageCart}
                autoFocus
                pending={apiRequest}
              >
                Remove
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <TermsPolicy.Contract
            open={openTermDialog}
            eventHandler={handleTermDialog}
          />
        </Container>
      </ClientLayout>
    </>
  )
}

interface iTableHead {
  label: string
  align?: 'right' | 'left' | 'center'
}

const productHead: iTableHead[] = [
  { label: 'Product', align: 'left' },
  { label: 'Price', align: 'center' },
  { label: 'Quantity', align: 'center' },
]

const chapelHead: iTableHead[] = [
  { label: 'Chapel', align: 'left' },
  { label: 'Price per day', align: 'center' },
  { label: 'Date', align: 'center' },
]

interface iTableRowCell {
  id: number
  product: {
    name: string
    price: number
  }
  price: number
  quantity: number
}

const schema = yup.object().shape({
  name: yup.string(),
  address: yup.string().trim().required('Address is required'),
  phoneNumber: yup.string().trim().required('Contact number is required'),
  deceased: yup.string().trim().required('Deceased is required'),
  placeBurial: yup.string().trim('Place of Burial is required'),
})

interface iContract {
  name: string
  address: string
  phoneNumber: string
  deceased: string
  placeBurial: string
}

export default Cart
