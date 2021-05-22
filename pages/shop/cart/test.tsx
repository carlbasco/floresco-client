import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
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

import { pesoFormat, PhoneNumberFormat } from '@components'
import { ClientLayout } from '@layouts'
import useStyles from '@styles/pages/shop/cart'
import { axiosInstance, Snackbar } from '@lib'
import { useSelector } from 'react-redux'
import { iRootState } from '@redux'

const Cart = () => {
  const { data: chapelCartApi } = useSWR('/api/reservation')
  const { data: productCartApi } = useSWR('/api/orderitems')
  const { data: cartCountApi } = useSWR('/api/cart/count')
  const { data: contractApi } = useSWR(
    cartCountApi === 0 || undefined ? '' : '/api/contract/form'
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
    if (contractApi) {
      setValue('name', `${user.lastName}, ${user.firstName} ${user.middleName}`)
      setValue('address', !contractApi?.address ? '' : contractApi?.address)
      setValue('deceased', !contractApi?.deceased ? '' : contractApi?.deceased)
      setValue(
        'contactNumber',
        !contractApi?.contactNumber ? '' : contractApi?.contactNumber
      )
      setValue(
        'placeBurial',
        !contractApi?.placeBurial ? '' : contractApi?.placeBurial
      )
    }
  }, [contractApi])

  const calculate = () => {
    if (chapelCartApi && productCartApi) {
      if (productCartApi.length > 0 && chapelCartApi.length > 0) {
        let temp =
          productCartApi?.reduce(
            (total: number, val: any) => total + val.price * val.quantity,
            0
          ) + chapelCartApi[0].price
        setTotal(temp)
      }
      if (productCartApi.length > 0 && chapelCartApi.length <= 0) {
        setTotal(
          productCartApi?.reduce(
            (total: number, val: any) => total + val.price * val.quantity,
            0
          )
        )
      }
      if (productCartApi.length <= 0 && chapelCartApi.length > 0) {
        setTotal(chapelCartApi[0].price)
      }
      if (productCartApi.length <= 0 && chapelCartApi.length <= 0) {
        setTotal(0)
      }
    }
  }
  const [total, setTotal] = useState(0)
  useEffect(() => {
    calculate()
  }, [productCartApi, chapelCartApi])

  const triggerApi = () => {
    trigger('/api/cart')
    trigger('/api/reservation')
    trigger('/api/cart/count')
    calculate()
  }

  const [apiRequest, setApiRequest] = useState(false)

  const [cartValues, setCartValues] = useState<any>([])
  useEffect(() => {
    if (productCartApi) {
      setCartValues(productCartApi)
    }
  }, [productCartApi])
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

  const [handleDeleteDialog, setHandleDeleteDialog] = useState(false)
  const handleClickDialog = () => {
    setHandleDeleteDialog(!handleDeleteDialog)
  }
  const [selectedValue, setSelectedValue] = useState({
    name: '',
    id: 0,
  })
  const handleDelete = (id: number, name: string) => {
    setSelectedValue({ ...selectedValue, id, name })
    handleClickDialog()
  }
  const deleteCartItem = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete(
        '/api/cart/item/' + selectedValue.id
      )
      const res = await req.data
      triggerApi()
      Snackbar.success(res.msg)
      setApiRequest(false)
      handleClickDialog()
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

  const [openChapelDeleteDialog, setOpenChapelDeleteDialog] = useState(false)
  const handleChapelDeleteDialog = () => {
    setOpenChapelDeleteDialog(!openChapelDeleteDialog)
  }
  const deleteChapel = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete(
        '/api/reservation/' + chapelCartApi[0].id
      )
      const res = await req.data
      triggerApi()
      Snackbar.success(res.msg)
      handleChapelDeleteDialog()
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

  const handleCheckOut = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/contract/' + contractApi?.id)
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
                      {!productCartApi ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            className={classes.noBorderCell}
                          >
                            <CircularProgress />
                            <Typography variant="subtitle2">Loading</Typography>
                          </TableCell>
                        </TableRow>
                      ) : productCartApi?.length <= 0 ? (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              className={classes.noBorderCell}
                            >
                              <Typography variant="subtitle2">
                                Product Cart is empty
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              className={classes.noBorderCell}
                            />
                          </TableRow>
                        </>
                      ) : (
                        <>
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
                                  {pesoFormat(item?.price)}
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
                                      disabled={apiRequest}
                                      className={classes.btnDecrement}
                                      onClick={() => decrementQty(index)}
                                    >
                                      <RemoveCircle color="secondary" />
                                    </IconButton>
                                  </Tooltip>
                                  {item?.quantity}
                                  <Tooltip title="add quantity">
                                    <IconButton
                                      disabled={apiRequest}
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
                                  {pesoFormat(item?.price * item?.quantity)}
                                </TableCell>
                                <TableCell
                                  className={classes.noBorderCell}
                                  sx={{ minWidth: '3.2em' }}
                                >
                                  <Tooltip title="remove product from cart">
                                    <IconButton
                                      disabled={apiRequest}
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
                              >
                                Update Cart
                              </LoadingButton>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                      {!chapelCartApi && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            className={classes.noBorderCell}
                          >
                            <CircularProgress />
                            <Typography variant="subtitle2">Loading</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {chapelCartApi?.length <= 0 ? (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              className={classes.noBorderCell}
                            >
                              <Typography variant="subtitle2">
                                Chapel Cart is empty
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              className={classes.noBorderCell}
                            />
                          </TableRow>
                        </>
                      ) : (
                        chapelCartApi?.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell
                              sx={{ minWidth: '150px', fontWeight: 600 }}
                              className={classes.noBorderCell}
                            >
                              {item?.chapel.name}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ minWidth: '120px' }}
                              className={classes.noBorderCell}
                            >
                              {pesoFormat(item?.chapel.price)}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ minWidth: '170px' }}
                              className={classes.noBorderCell}
                            >
                              {moment(item?.startDate).format('LL')}
                              <div>&nbsp;to&nbsp;</div>
                              {moment(item?.endDate).format('LL')}
                            </TableCell>

                            <TableCell
                              className={classes.noBorderCell}
                              align="center"
                              sx={{ minWidth: '120px' }}
                            >
                              {pesoFormat(item?.price)}
                            </TableCell>
                            <TableCell
                              className={classes.noBorderCell}
                              sx={{ minWidth: '3.2em' }}
                            >
                              <Tooltip title="remove chapel from cart">
                                <IconButton
                                  disabled={apiRequest}
                                  onClick={handleChapelDeleteDialog}
                                >
                                  <Delete color="error" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className={classes.noBorderCell}
                        />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
                              name="contactNumber"
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
                                    error={Boolean(errors.contactNumber)}
                                  >
                                    {errors.contactNumber?.message}
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
                            disabled={apiRequest}
                          >
                            Update Contract
                          </LoadingButton>
                        </form>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}
              <Paper elevation={17} className={classes.paper}>
                {/* <Typography variant="subtitle1" gutterBottom>
                  Order Summary
                </Typography> */}
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.noBorderCell}>
                        <Typography variant="body1" fontWeight={600}>
                          Total Price
                        </Typography>
                      </TableCell>
                      <TableCell className={classes.noBorderCell} align="right">
                        <Typography
                          variant="body1"
                          color="primary"
                          fontWeight={600}
                        >
                          {pesoFormat(total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {cartCountApi > 0 && (
                  <>
                    <Divider variant="middle" />
                    <FormHelperText
                      sx={{ textAlign: 'center', fontStyle: 'italic' }}
                    >
                      Please make sure to update Contract Form and update the
                      Cart items after changing it before proceeding to checkout
                    </FormHelperText>
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      className={classes.btn}
                      pending={apiRequest}
                      onClick={handleCheckOut}
                    >
                      Check Out
                    </LoadingButton>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
          <Dialog open={handleDeleteDialog} onClose={handleClickDialog}>
            <DialogTitle>Delete Product Cart item?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
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
                onClick={handleClickDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                className={classes.btnDelete}
                onClick={deleteCartItem}
                autoFocus
                pending={apiRequest}
              >
                Remove
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <Dialog open={openChapelDeleteDialog} onClose={handleClickDialog}>
            <DialogTitle>Delete Chapel Reservation?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to remove this reservation from your cart?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={apiRequest}
                className={classes.btnCancel}
                onClick={handleChapelDeleteDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                className={classes.btnDelete}
                onClick={deleteChapel}
                autoFocus
                pending={apiRequest}
              >
                Remove
              </LoadingButton>
            </DialogActions>
          </Dialog>
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
  contactNumber: yup.string().trim().required('Contact number is required'),
  deceased: yup.string().trim().required('Deceased is required'),
  placeBurial: yup.string().trim('Place of Burial is required'),
})

interface iContract {
  name: string
  address: string
  contactNumber: string
  deceased: string
  placeBurial: string
}

export default Cart
