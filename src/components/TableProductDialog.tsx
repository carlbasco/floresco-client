import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDropzone } from 'react-dropzone'
import {
  Button,
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
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Typography,
} from '@material-ui/core'
import { AddAPhoto, Close } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'
import Slider from 'react-slick'

import {
  CloudLoading,
  PesoNumberFormat,
  pesoFormat,
  SpanBadge,
} from '@components'
import { axiosInstance, Snackbar } from '@lib'
import useSWR, { trigger } from 'swr'
import useStyles from '@styles/components/tableStyles'
import dropZoneStyle from '@styles/components/dropZone'
import productStyle from '@styles/components/viewProduct'

const NewDialog = (props: iNewProps) => {
  const { data: categoryApi } = useSWR('/api/category')
  const { data: packageApi } = useSWR('/api/package')
  const [apiRequest, setApiRequest] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const [files, setFiles] = useState<any | null>([])
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png, image/jpg, image/webp',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })
  const removeAllFiles = () => {
    setFiles([])
  }
  const removeFile = (file: any) => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const dzStyle = dropZoneStyle()
  const thumbs = files.map((file: any) => (
    <div className={dzStyle.dropzone} key={file.name}>
      <div className={dzStyle.thumb}>
        <div className={dzStyle.thumbInner}>
          <img src={file.preview} className={dzStyle.img} />
        </div>
      </div>
      <button
        type="button"
        onClick={removeFile(file)}
        className={dzStyle.btnRemove}
      >
        remove
      </button>
    </div>
  ))

  useEffect(
    () => () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  const handleCloseDialog = () => {
    removeAllFiles()
    props.eventHandler()
    reset({ name: '' }, { keepDefaultValues: true })
  }

  const onSubmit = async (data: iForm) => {
    const fd = new FormData()
    files.forEach((file: any) => {
      fd.append('images', file)
    })
    Object.entries(data).forEach(([key, data]) => {
      fd.append(key, data)
    })
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/product', fd)
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/product')
      props.eventHandler()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
      handleCloseDialog()
    }
  }

  const classes = useStyles()
  return (
    <>
      <Dialog
        maxWidth="xs"
        open={props.open}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            New Product
            <IconButton
              onClick={handleCloseDialog}
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
                <InputLabel required>Category</InputLabel>
                <Controller
                  name="category"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Select
                        labelWidth={80}
                        onChange={onChange}
                        value={value ? value : ''}
                      >
                        <MenuItem value="">
                          <em>----------</em>
                        </MenuItem>
                        {categoryApi?.map((item: any) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={Boolean(errors.category)}>
                        {errors.category?.message}
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
                <InputLabel>Package</InputLabel>
                <Controller
                  name="packageId"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Select
                        labelWidth={67}
                        onChange={onChange}
                        value={value ? value : ''}
                      >
                        <MenuItem value="">
                          <em>----------</em>
                        </MenuItem>
                        {packageApi?.map((item: any) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={Boolean(errors.package)}>
                        {errors.package?.message}
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
              <InputLabel>Image</InputLabel>
              <div className={dzStyle.mainContainer}>
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={dzStyle.box}
                >
                  <input {...getInputProps()} />
                  <div className={dzStyle.paragraph}>
                    <AddAPhoto />
                    <p>Drop or Select File</p>
                  </div>
                </div>
                <aside className={dzStyle.thumbsContainer}>{thumbs}</aside>
              </div>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel required>Price</InputLabel>
                <Controller
                  name="price"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        value={value}
                        labelWidth={50}
                        inputComponent={PesoNumberFormat as any}
                        onChange={(e) => onChange(e.target.value)}
                      />
                      <FormHelperText error={Boolean(errors.price)}>
                        {errors.price?.message}
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
                Create Product
              </LoadingButton>
            </form>
          </DialogContent>
        </div>
      </Dialog>
      <CloudLoading animation="upload" open={apiRequest} />
    </>
  )
}

const EditDialog = (props: iEditProps) => {
  const { data: categoryApi } = useSWR('/api/category')
  const { data: packageApi } = useSWR('/api/package')
  const { data: productApi, isValidating } = useSWR(
    props.open ? '/api/product/' + props.id : null,
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

  const [files, setFiles] = useState<any | null>([])
  const removeAllFiles = () => {
    setFiles([])
  }
  const removeFile = (file: any) => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png, image/jpg, image/webp',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  const handleCloseDialog = () => {
    removeAllFiles()
    props.eventHandler()
  }

  const dzStyle = dropZoneStyle()
  const thumbs = files.map((file: any) => (
    <div className={dzStyle.dropzone} key={file.name}>
      <div className={dzStyle.thumb}>
        <div className={dzStyle.thumbInner}>
          <img src={file.preview} className={dzStyle.img} />
        </div>
      </div>
      <button onClick={removeFile(file)} className={dzStyle.btnRemove}>
        remove
      </button>
    </div>
  ))

  useEffect(
    () => () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )
  useEffect(() => {
    if (productApi) {
      setValue('name', productApi.name)
      setValue('category', productApi.category.id)
      setValue('description', productApi.description)
      setValue('price', productApi.price)
      setValue('isHidden', productApi.isHidden)
      if (productApi.package) {
        setValue('packageId', productApi?.package.id)
      }
    }
  }, [productApi])

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>()
  const handleDeleteDialog = () => setDeleteDialog(!deleteDialog)
  const handleClickDeleteDialog = (id: number) => {
    setSelectedId(id)
    handleDeleteDialog()
  }

  const deleteImage = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete('/api/productImage/' + selectedId)
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/product/' + props.id)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
      handleDeleteDialog()
    }
  }

  const onSubmit = async (data: iForm) => {
    const fd = new FormData()
    files.forEach((file: any) => {
      fd.append('images', file)
    })
    Object.entries(data).forEach(([key, data]) => {
      fd.append(key, data)
    })
    try {
      setApiRequest(true)
      const req = await axiosInstance.put('/api/product/' + props.id, fd)
      const res = await req.data
      Snackbar.success(res.msg)
      reset({ name: '', isHidden: false }, { keepDefaultValues: true })
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      trigger('/api/product')
      setApiRequest(false)
      handleCloseDialog()
    }
  }

  const classes = useStyles()
  return (
    <>
      <Dialog
        maxWidth="sm"
        open={props.open}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            Edit Product
            <IconButton
              onClick={handleCloseDialog}
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
                <InputLabel required>Category</InputLabel>
                <Controller
                  name="category"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Select
                        labelWidth={80}
                        onChange={onChange}
                        value={value ? value : ''}
                      >
                        <MenuItem value="">
                          <em>----------</em>
                        </MenuItem>
                        {categoryApi?.map((item: any) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={Boolean(errors.category)}>
                        {errors.category?.message}
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
                <InputLabel>Package</InputLabel>
                <Controller
                  name="packageId"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Select
                        labelWidth={67}
                        onChange={onChange}
                        value={value ? value : ''}
                      >
                        <MenuItem value="">
                          <em>----------</em>
                        </MenuItem>
                        {packageApi?.map((item: any) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={Boolean(errors.package)}>
                        {errors.package?.message}
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
              <InputLabel>Existing Image</InputLabel>
              <div className={dzStyle.mainContainer}>
                <div className={dzStyle.thumbsContainer}>
                  {productApi?.productImage ? (
                    productApi.productImage.map((item: any) => (
                      <div className={dzStyle.dropzone} key={item.id}>
                        <div className={dzStyle.thumb}>
                          <div className={dzStyle.thumbInner}>
                            <img
                              src={item.secure_url}
                              className={dzStyle.img}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={dzStyle.btnRemove}
                          onClick={() => handleClickDeleteDialog(item.id)}
                        >
                          delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <>
                      <p>No Image</p>
                    </>
                  )}
                </div>
              </div>
              <InputLabel>New Image</InputLabel>
              <div className={dzStyle.mainContainer}>
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={dzStyle.box}
                >
                  <input {...getInputProps()} />
                  <div className={dzStyle.paragraph}>
                    <AddAPhoto />
                    <p>Drop or Select File</p>
                  </div>
                </div>
                <aside className={dzStyle.thumbsContainer}>{thumbs}</aside>
              </div>
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
                      sx={{ flexDirection: 'row' }}
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
                <InputLabel required>Price</InputLabel>
                <Controller
                  name="price"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        value={value}
                        labelWidth={50}
                        inputComponent={PesoNumberFormat as any}
                        onChange={(e) => onChange(e.target.value)}
                      />
                      <FormHelperText error={Boolean(errors.price)}>
                        {errors.price?.message}
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
                Update Product
              </LoadingButton>
            </form>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog open={deleteDialog}>
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={apiRequest}
            className={classes.btnCancel}
            onClick={handleDeleteDialog}
          >
            Cancel
          </Button>
          <LoadingButton
            className={classes.btnDelete}
            onClick={deleteImage}
            autoFocus
            pending={apiRequest}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <CloudLoading open={isValidating ? true : false} animation="download" />
      <CloudLoading open={apiRequest} animation="upload" />
    </>
  )
}

const DeleteDialog = (props: iDeleteProps) => {
  const [apiDeleteRequest, setApiDeleteRequest] = useState(false)
  const handleClickDelete = async () => {
    setApiDeleteRequest(true)
    if (props?.id) {
      try {
        const req = await axiosInstance.delete('/api/product/' + props.id)
        const res = await req.data
        Snackbar.success(res.msg)
      } catch (err) {
        if (err.response.data.msg) {
          Snackbar.error(err.response.data.msg)
        }
      } finally {
        trigger('/api/product')
        setApiDeleteRequest(false)
        props.eventHandler()
      }
    }
  }

  const classes = useStyles()
  return (
    <Dialog
      open={props.open}
      onClose={props.eventHandler}
      PaperProps={{ style: { margin: '1em' } }}
    >
      <DialogTitle>Delete Product?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete
          <span className={classes.span}>&nbsp; {props.name}&nbsp;</span>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={apiDeleteRequest}
          className={classes.btnCancel}
          onClick={props.eventHandler}
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

const ViewDialog = (props: iViewDialogProps) => {
  const { data: productApi, isValidating } = useSWR(
    props.open ? '/api/product/' + props.id : null,
    { refreshInterval: 0 }
  )
  const [nav1, setNav1] = useState<any | null>()
  const [nav2, setNav2] = useState<any | null>()
  const slider1 = useRef(null)
  const slider2 = useRef(null)

  const classes = useStyles()
  const dzStyle = productStyle()
  return (
    <>
      <Dialog
        maxWidth="md"
        open={props.open}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            View Product
            <IconButton
              onClick={props.eventHandler}
              className={classes.btnClose}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={dzStyle.dialogContent}>
            {isValidating ? (
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Skeleton
                    variant="rectangular"
                    className={dzStyle.skeletonSliderImg}
                    animation="wave"
                  />
                  <div className={dzStyle.skeletonSliderBottom}>
                    <Skeleton variant="rectangular" animation="wave" />
                    <Skeleton variant="rectangular" animation="wave" />
                    <Skeleton variant="rectangular" animation="wave" />
                  </div>
                </Grid>
                <Grid item xs={12} md={5} className={dzStyle.productMain}>
                  <Skeleton height={50} />
                  <Skeleton animation="wave" height={250} />
                  <Grid container>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={30} animation="wave" />
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={30} animation="wave" />
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Paper variant="outlined">
                    {productApi?.productImage.lenth <= 0 ? (
                      <>
                        <Slider
                          asNavFor={nav2}
                          className={dzStyle.slider}
                          ref={(slider1) => setNav1(slider1)}
                        >
                          <div className={dzStyle.sliderImgContainer}>
                            <img
                              src="/noimg.jpg"
                              alt="no image"
                              className={dzStyle.sliderImg}
                            />
                          </div>
                        </Slider>
                      </>
                    ) : (
                      <>
                        <Slider
                          asNavFor={nav2}
                          className={dzStyle.slider}
                          ref={(slider1) => setNav1(slider1)}
                        >
                          {productApi?.productImage.map((item: any) => (
                            <div key={item.id}>
                              <div className={dzStyle.sliderImgContainer}>
                                <img
                                  src={item.secure_url}
                                  alt={productApi?.name}
                                  className={dzStyle.sliderImg}
                                />
                              </div>
                            </div>
                          ))}
                        </Slider>
                        {productApi?.productImage.length > 1 && (
                          <Slider
                            asNavFor={nav1}
                            ref={(slider2) => setNav2(slider2)}
                            slidesToShow={3}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            arrows={false}
                            infinite={productApi?.productImage.length > 3}
                          >
                            {productApi?.productImage.map((item: any) => (
                              <div key={item.id}>
                                <div className={dzStyle.sliderImgContainer}>
                                  <img
                                    src={item.secure_url}
                                    alt={productApi?.name}
                                    className={dzStyle.sliderImgSM}
                                  />
                                </div>
                              </div>
                            ))}
                          </Slider>
                        )}
                      </>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={5} className={dzStyle.productMain}>
                  <div className={dzStyle.productMB}>
                    <Typography variant="h5" align="center" fontWeight={700}>
                      {productApi?.name}
                    </Typography>
                  </div>
                  <div className={dzStyle.productMB}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      Description:
                    </Typography>
                    <Typography variant="body1" align="justify">
                      {productApi?.description}
                    </Typography>
                  </div>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Status:
                      </Typography>
                      {productApi?.isHidden ? (
                        <SpanBadge label="Hidden" variant="error" />
                      ) : (
                        <SpanBadge label="Visible" variant="success" />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Price:
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {productApi?.price ? pesoFormat(productApi?.price) : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Package:
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {productApi?.package !== null
                          ? productApi?.package.name
                          : 'None'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}

interface iNewProps {
  open: boolean
  eventHandler: () => void
}

interface iEditProps {
  id: number
  open: boolean
  eventHandler: () => void
}

interface iDeleteProps {
  id: number
  name: string
  open: boolean
  eventHandler: () => void
}

interface iViewDialogProps {
  id: number
  open: boolean
  eventHandler: () => void
}

interface iForm {
  name: string
  minPrice: number
  maxPrice: number
}
const schema = yup.object().shape({
  name: yup.string().trim().required('Name of product is required'),
  price: yup.number().positive().required('Price is required').typeError('Price must be a number'),
  category: yup.string().required('Category is required'),
  packageId: yup.string(),
  description: yup.string().trim().required('Description is required'),
  isHidden: yup.boolean(),
})

export default { NewDialog, EditDialog, DeleteDialog, ViewDialog }
