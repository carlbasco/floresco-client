import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'

import { axiosInstance, Snackbar } from '@lib'
import useStyles from '@styles/components/tableStyles'
import useSWR, { trigger } from 'swr'
import { CloudLoading, pesoFormat, SpanBadge } from '@components'

const NewDialog = (props: iNewDialog) => {
  const [apiRequest, setApiRequest] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data: iPackage) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/package', data)
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/package')
      props.eventHandler()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      reset({ name: '', isHidden: false })
      setApiRequest(false)
    }
  }

  const classes = useStyles()
  return (
    <>
      <Dialog maxWidth="xs" open={props.open}>
        <div className={classes.dialog}>
          <DialogTitle>
            New Package
            <IconButton
              onClick={props.eventHandler}
              className={classes.btnClose}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel required>Name</InputLabel>
                <Controller
                  name="name"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        value={value}
                        labelWidth={55}
                        onChange={(e) => onChange(e.target.value)}
                      />
                      <FormHelperText error={Boolean(errors.name)}>
                        {errors.name?.message}
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
                <InputLabel required>Description</InputLabel>
                <Controller
                  name="description"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        rows={4}
                        type="text"
                        multiline={true}
                        labelWidth={100}
                        value={value}
                        onChange={onChange}
                      />
                      <FormHelperText error={Boolean(errors.description)}>
                        {errors.description?.message}
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
                <InputLabel required>Discount</InputLabel>
                <Controller
                  name="discount"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        value={value}
                        labelWidth={80}
                        onChange={(e) => onChange(e.target.value)}
                        endAdornment={'%'}
                      />
                      <FormHelperText error={Boolean(errors.discount)}>
                        {errors.discount?.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </FormControl>
              <LoadingButton
                fullWidth
                type="submit"
                size="large"
                variant="contained"
                pending={apiRequest}
                className={classes.btnSubmit}
              >
                Create Package
              </LoadingButton>
            </form>
          </DialogContent>
        </div>
      </Dialog>
      <CloudLoading animation="upload" open={apiRequest} />
    </>
  )
}

const EditDialog = (props: iEditDialog) => {
  const { data: apiPackage, isValidating } = useSWR<iPackage>(
    props.open ? '/api/package/' + props.id : null,
    { refreshInterval: 0 }
  )
  const [apiRequest, setApiRequest] = useState(false)
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (apiPackage) {
      setValue('name', apiPackage.name)
      setValue('isHidden', apiPackage.isHidden)
      setValue('description', apiPackage.description)
      setValue('discount', apiPackage.discount)
    }
    return () => {
      setValue('name', '')
      setValue('description', '')
      setValue('discount', '')
    }
  }, [apiPackage])

  const onSubmit = async (data: iPackage) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.put('/api/package/' + props.id, data)
      const res = await req.data
      Snackbar.success(res.msg)
      reset({ name: '', isHidden: false }, { keepDefaultValues: true })
      props.eventHandler()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
      trigger('/api/package')
    }
  }

  const classes = useStyles()
  return (
    <>
      <Dialog maxWidth="xs" open={props.open}>
        <div className={classes.dialog}>
          <DialogTitle>
            Edit Package
            <IconButton
              onClick={props.eventHandler}
              className={classes.btnClose}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel required>Name</InputLabel>
                <Controller
                  name="name"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        disabled
                        value={value}
                        labelWidth={55}
                        onChange={(e) => onChange(e.target.value)}
                      />
                      <FormHelperText error={Boolean(errors.name)}>
                        {errors.name?.message}
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
                <InputLabel required>Description</InputLabel>
                <Controller
                  name="description"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        rows={4}
                        type="text"
                        multiline={true}
                        labelWidth={100}
                        value={value}
                        onChange={onChange}
                      />
                      <FormHelperText error={Boolean(errors.description)}>
                        {errors.description?.message}
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
                <FormLabel>Status</FormLabel>
                <Controller
                  name="isHidden"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      style={{ flexDirection: 'row' }}
                      onChange={(e) => {
                        onChange(e.target.value === 'true' ? true : false)
                      }}
                    >
                      <FormControlLabel
                        value={true}
                        label="Hidden"
                        control={<Radio color="primary" />}
                      />
                      <FormControlLabel
                        value={false}
                        label="Visible"
                        control={<Radio color="primary" />}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel required>Discount</InputLabel>
                <Controller
                  name="discount"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        value={value}
                        labelWidth={80}
                        onChange={(e) => onChange(e.target.value)}
                        endAdornment={'%'}
                      />
                      <FormHelperText error={Boolean(errors.discount)}>
                        {errors.discount?.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </FormControl>
              <LoadingButton
                fullWidth
                type="submit"
                size="large"
                variant="contained"
                pending={apiRequest}
                className={classes.btnSubmit}
              >
                Update Package
              </LoadingButton>
            </form>
          </DialogContent>
        </div>
      </Dialog>
      <CloudLoading open={isValidating ? true : false} animation="download" />
      <CloudLoading open={apiRequest} animation="upload" />
    </>
  )
}

const DeleteDialog = (props: iDeleteDialog) => {
  const [apiDeleteRequest, setApiDeleteRequest] = useState(false)
  const { selectedPackage, open, eventHandler } = props
  const handleClickDelete = async () => {
    setApiDeleteRequest(true)
    if (selectedPackage.id) {
      try {
        const req = await axiosInstance.delete(
          '/api/package/' + selectedPackage.id
        )
        const res = await req.data
        Snackbar.success(res.msg)
      } catch (err) {
        if (err.response.data.msg) {
          Snackbar.error(err.response.data.msg)
        }
      } finally {
        trigger('/api/package')
        setApiDeleteRequest(false)
        eventHandler()
      }
    }
  }
  const classes = useStyles()
  return (
    <Dialog open={open} onClose={eventHandler}>
      <DialogTitle>Delete Package?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete
          <span className={classes.span}>
            &nbsp; {selectedPackage?.name}&nbsp;
          </span>
          ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={apiDeleteRequest}
          className={classes.btnCancel}
          onClick={eventHandler}
        >
          Cancel
        </Button>
        <LoadingButton
          className={classes.btnDelete}
          onClick={handleClickDelete}
          autoFocus
          pending={apiDeleteRequest}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

const ViewDialog = (props: iViewDialog) => {
  const { data: packageApi, isValidating } = useSWR(
    props.open ? '/api/package/' + props.id : null
  )

  const classes = useStyles()
  return (
    <>
      <Dialog
        maxWidth="md"
        open={props.open}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            View Package
            <IconButton
              onClick={props.eventHandler}
              className={classes.btnClose}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            <div style={{ width: '500px', padding: '1em 1.5em' }}>
              <Grid container direction="row">
                {isValidating ? (
                  <>
                    <Grid item xs={6}>
                      <Skeleton
                        height={60}
                        width={120}
                        variant="text"
                        animation="wave"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton
                        height={60}
                        width={120}
                        variant="text"
                        animation="wave"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          height={60}
                        />
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={6} display="inline-flex">
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Name:&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageApi?.name}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      alignItems="baseline"
                      display="inline-flex"
                    >
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Status:&nbsp;&nbsp;
                      </Typography>
                      <SpanBadge
                        label={packageApi?.isHidden ? 'Hidden' : 'Visible'}
                        variant={packageApi?.isHidden ? 'error' : 'success'}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main', marginTop: '.5em' }}
                      >
                        Description:&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageApi?.description}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              <TableContainer
                sx={{ marginTop: '1em' }}
                className={classes.tableContainer}
              >
                <Typography variant="subtitle2" color="primary">
                  Product List:
                </Typography>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isValidating ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <CircularProgress />
                          <Typography variant="subtitle2">Loading</Typography>
                        </TableCell>
                      </TableRow>
                    ) : packageApi?.Product.length <= 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="subtitle2">No Data</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {packageApi?.Product.map((item: iProduct) => (
                          <TableRow key={item.id}>
                            <TableCell colSpan={2}>{item.name}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell align="right" colSpan={2}>
                            Price
                          </TableCell>
                          <TableCell align="right">
                            {packageApi?.Product.length <= 0
                              ? 'Not Available'
                              : packageApi?.Product &&
                                pesoFormat(
                                  packageApi?.Product.reduce(
                                    (total: number, val: any) =>
                                      total + val.price,
                                    0
                                  )
                                )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="right" colSpan={2}>
                            Discount
                          </TableCell>
                          <TableCell align="right">
                            {packageApi?.discount}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="right" colSpan={2}>
                            Final Price
                          </TableCell>
                          <TableCell align="right">
                            {packageApi?.Product.length > 0 &&
                              pesoFormat(
                                packageApi?.Product.reduce(
                                  (total: number, val: any) =>
                                    total + val.price,
                                  0
                                ) -
                                  (packageApi?.discount / 100) *
                                    packageApi?.Product.reduce(
                                      (total: number, val: any) =>
                                        total + val.price,
                                      0
                                    )
                              )}
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}

interface iNewDialog {
  open: boolean
  eventHandler: () => void
}

interface iEditDialog {
  id: number
  open: boolean
  eventHandler: () => void
}

interface iDeleteDialog {
  selectedPackage: { id: number; name: string }
  open: boolean
  eventHandler: () => void
}

interface iViewDialog {
  id: number
  open: boolean
  eventHandler: () => void
}

interface iPackage {
  name: string
  description: string
  discount: number
  isHidden: boolean
}

interface iProduct {
  id: number
  name: string
  price: number
}

const schema = yup.object().shape({
  name: yup.string().trim().required('Name of package is required'),
  description: yup.string().trim(),
  discount: yup.number().required('Discount is required'),
  isHidden: yup.boolean(),
})

export default { NewDialog, EditDialog, DeleteDialog, ViewDialog }
