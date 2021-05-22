import { useEffect, useState } from 'react'
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
  IconButton,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import { AddAPhoto, Close } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'

import {
  CloudLoading,
  PesoNumberFormat,
} from '@components'
import { axiosInstance, Snackbar } from '@lib'
import useSWR, { trigger } from 'swr'
import useStyles from '@styles/components/tableStyles'
import dropZoneStyle from '@styles/components/dropZone'

const NewForm = (props: iNewFormProps) => {
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

  const style = dropZoneStyle()
  const thumbs = files.map((file: any) => (
    <div className={style.dropzone} key={file.name}>
      <div className={style.thumb}>
        <div className={style.thumbInner}>
          <img src={file.preview} className={style.img} />
        </div>
      </div>
      <button
        type="button"
        onClick={removeFile(file)}
        className={style.btnRemove}
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
      const req = await axiosInstance.post('/api/chapel', fd)
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/chapel')
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
            New Chapel
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
              <div className={style.mainContainer}>
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={style.box}
                >
                  <input {...getInputProps()} />
                  <div className={style.paragraph}>
                    <AddAPhoto />
                    <p>Drop or Select File</p>
                  </div>
                </div>
                <aside className={style.thumbsContainer}>{thumbs}</aside>
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
                Create Chapel
              </LoadingButton>
            </form>
          </DialogContent>
        </div>
      </Dialog>
      <CloudLoading animation="upload" open={apiRequest} />
    </>
  )
}

const EditForm = (props: iEditFormProps) => {
  const { data: chapelApi, isValidating } = useSWR(
    props.open ? '/api/chapel/' + props.id : null,
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

  const style = dropZoneStyle()
  const thumbs = files.map((file: any) => (
    <div className={style.dropzone} key={file.name}>
      <div className={style.thumb}>
        <div className={style.thumbInner}>
          <img src={file.preview} className={style.img} />
        </div>
      </div>
      <button onClick={removeFile(file)} className={style.btnRemove}>
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
    if (chapelApi) {
      setValue('name', chapelApi.name)
      setValue('description', chapelApi.description)
      setValue('price', chapelApi.price)
      setValue('isHidden', chapelApi.isHidden)
    }
  }, [chapelApi])

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
      const req = await axiosInstance.delete('/api/chapelImage/' + selectedId)
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/chapel/' + props.id)
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
      const req = await axiosInstance.put('/api/chapel/' + props.id, fd)
      const res = await req.data
      Snackbar.success(res.msg)
      reset({ name: '', isHidden: false }, { keepDefaultValues: true })
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      trigger('/api/chapel')
      setApiRequest(false)
      handleCloseDialog()
    }
  }

  const classes = useStyles()
  return (
    <>
      <Dialog maxWidth="sm" open={props.open}>
        <div className={classes.dialog}>
          <DialogTitle>
            Edit Chapel
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
              <div className={style.mainContainer}>
                <div className={style.thumbsContainer}>
                  {chapelApi?.chapelImage ? (
                    chapelApi.chapelImage.map((item: any) => (
                      <div className={style.dropzone} key={item.id}>
                        <div className={style.thumb}>
                          <div className={style.thumbInner}>
                            <img src={item.secure_url} className={style.img} />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={style.btnRemove}
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
              <div className={style.mainContainer}>
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className={style.box}
                >
                  <input {...getInputProps()} />
                  <div className={style.paragraph}>
                    <AddAPhoto />
                    <p>Drop or Select File</p>
                  </div>
                </div>
                <aside className={style.thumbsContainer}>{thumbs}</aside>
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
                Update Chapel
              </LoadingButton>
            </form>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog open={deleteDialog}>
        <DialogTitle>Delete Chapel?</DialogTitle>
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

const DeleteDialog = (props: iDeleteFormProps) => {
  const [apiDeleteRequest, setApiDeleteRequest] = useState(false)
  const handleClickDelete = async () => {
    setApiDeleteRequest(true)
    if (props?.id) {
      try {
        const req = await axiosInstance.delete('/api/chapel/' + props.id)
        const res = await req.data
        Snackbar.success(res.msg)
      } catch (err) {
        if (err.response.data.msg) {
          Snackbar.error(err.response.data.msg)
        }
      } finally {
        trigger('/api/chapel')
        setApiDeleteRequest(false)
        props.eventHandler()
      }
    }
  }

  const classes = useStyles()
  return (
    <Dialog open={props.open} onClose={props.eventHandler}>
      <DialogTitle>Delete Chapel?</DialogTitle>
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

interface iNewFormProps {
  open: boolean
  eventHandler: () => void
}

interface iEditFormProps {
  id: number
  open: boolean
  eventHandler: () => void
}

interface iDeleteFormProps {
  id: number
  name: string
  open: boolean
  eventHandler: () => void
}

interface iForm {
  name: string
  minPrice: number
  maxPrice: number
}
const schema = yup.object().shape({
  name: yup.string().trim().required('Name of Chapel is required'),
  price: yup.number().positive().required('Price is required'),
  description: yup.string().trim().required('Description is required'),
  isHidden: yup.boolean(),
})

export default { NewForm, EditForm, DeleteDialog}
