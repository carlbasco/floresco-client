import { MouseEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Paper,
  Popper,
  Theme,
  Typography,
} from '@material-ui/core'
import {
  AccountCircle,
  Close,
  EmailOutlined,
  Logout,
  ManageAccounts,
  StickyNote2,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons'

import { iAuthState, iRootState, logoutUser } from '@redux'
import { LoadingButton } from '@material-ui/lab'
import { CloudLoading } from '@components'
import { axiosInstance, Snackbar } from '@lib'
import useStyles from '@styles/components/accountOptionMenu'

const AccountOptionMenu = ({ auth, logoutUser }: iProps) => {
  const router = useRouter()

  const [arrowRef, setArrowRef] = useState<HTMLSpanElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const handleClickOpenNotif = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }
  const handleClickCloseNotif = () => {
    setOpen(false)
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({ resolver: yupResolver(schema) })

  const [apiRequest, setApiRequest] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
  const handleClickOpenDialog = () => {
    handleClickCloseNotif()
    const { firstName, middleName, lastName, email } = auth.user
    if (middleName !== null || undefined) {
      setValue('middleName', middleName)
    }
    setValue('email', email)
    setValue('firstName', firstName)
    setValue('lastName', lastName)
    setOpenDialog(true)
  }
  const handleClickCloseDialog = () => {
    setOpenDialog(false)
  }

  const onSubmit = async (data: iForm) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance({
        url: `/api/auth/user/${auth.user.id}`,
        method: 'PUT',
        data,
      })
      const res = await req.data
      Snackbar.success(res.msg)
      Snackbar.info('This page will reload after 3 seconds')
      setTimeout(() => {
        window.location.reload()
      }, 3500)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
      handleClickCloseDialog()
    }
  }

  const handleClickLogout = async () => {
    const res = await logoutUser()
    if (res === 'success') {
      await router.replace('/login')
    }
  }

  const modifiers = [
    {
      name: 'arrow',
      enabled: true,
      options: {
        element: arrowRef,
      },
    },
  ]

  const classes = useStyles()
  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => handleClickOpenNotif(e)}
      >
        <AccountCircle />
      </IconButton>
      <Popper
        transition
        open={open}
        anchorEl={anchorEl}
        modifiers={modifiers}
        placement="bottom-end"
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={classes.paperRoot} elevation={4}>
              <ClickAwayListener onClickAway={handleClickCloseNotif}>
                <div>
                  <span className={classes.arrow} ref={setArrowRef} />
                  <div className={classes.content}>
                    <Typography
                      align="center"
                      variant="subtitle2"
                      sx={{ margin: '.5em 0' }}
                    >
                      Hi, {auth.user.firstName}
                    </Typography>
                    <Divider variant="middle" />
                    <MenuItem onClick={handleClickOpenDialog} disableRipple>
                      <ManageAccounts color="action" />
                      &nbsp; Account Settings
                    </MenuItem>
                    {auth.user.role === 'client' && (
                      <MenuItem
                        disableRipple
                        sx={{ margin: '.3em 0 .8em' }}
                        onClick={() => router.push('/shop/mycontracts')}
                      >
                        <StickyNote2 color="action" />
                        &nbsp;My Contracts
                      </MenuItem>
                    )}
                    <div style={{ margin: '.7em 1em .5em' }}>
                      <LoadingButton
                        fullWidth
                        color="inherit"
                        variant="outlined"
                        startIcon={<Logout />}
                        onClick={handleClickLogout}
                        pending={auth.fetchRequest}
                        className={classes.logoutBtn}
                      >
                        Logout
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Dialog maxWidth="xs" open={openDialog}>
        <div className={classes.dialog}>
          <DialogTitle>
            Account Settings
            <IconButton
              className={classes.closeBtn}
              onClick={handleClickCloseDialog}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="body2"
                color="primary"
                className={classes.typography}
              >
                Personal Information
              </Typography>
              <Controller
                name="firstName"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel required>First Name</InputLabel>
                    <OutlinedInput
                      value={value}
                      labelWidth={85}
                      onChange={(e) => onChange(e.target.value)}
                    />
                    <FormHelperText error={Boolean(errors.firstName)}>
                      {errors.firstName?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="middleName"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel>Middle Name</InputLabel>
                    <OutlinedInput
                      value={value}
                      labelWidth={105}
                      onChange={(e) => onChange(e.target.value)}
                    />
                    <FormHelperText error={Boolean(errors.middleName)}>
                      {errors.middleName?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="lastName"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel required>Last Name</InputLabel>
                    <OutlinedInput
                      value={value}
                      labelWidth={95}
                      onChange={(e) => onChange(e.target.value)}
                    />
                    <FormHelperText error={Boolean(errors.lastName)}>
                      {errors.lastName?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Typography
                variant="body2"
                color="primary"
                className={classes.typography}
              >
                Account Information
              </Typography>
              <Controller
                name="email"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel>Email Address</InputLabel>
                    <OutlinedInput
                      value={value}
                      disabled={true}
                      labelWidth={118}
                      onChange={(e) => onChange(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <EmailOutlined />
                        </InputAdornment>
                      }
                    />
                    <FormHelperText error={Boolean(errors.email)}>
                      {errors.email?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="password"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      value={value}
                      labelWidth={70}
                      onChange={(e) => onChange(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleClickShowPassword}
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText error={Boolean(errors.password)}>
                      {errors.password
                        ? errors.password?.message
                        : 'At least 6 characters'}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="confirmPassword"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl
                    className={classes.formControl}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel>Confirm Password</InputLabel>
                    <OutlinedInput
                      value={value}
                      labelWidth={140}
                      onChange={(e) => onChange(e.target.value)}
                      type={showConfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText error={Boolean(errors.confirmPassword)}>
                      {errors.confirmPassword?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <LoadingButton
                fullWidth
                type="submit"
                size="large"
                variant="contained"
                pending={apiRequest}
                className={classes.updateAccountBtn}
              >
                Update My Account
              </LoadingButton>
            </form>
          </DialogContent>
          <CloudLoading open={apiRequest} animation="upload" />
        </div>
      </Dialog>
    </>
  )
}

interface iProps {
  auth: iAuthState
  logoutUser: () => Promise<'success' | 'error'>
}
interface iForm {
  firstName: string
  middleName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
const schema = yup.object().shape({
  firstName: yup.string().trim().required('First name is required'),
  middleName: yup.string().trim(),
  lastName: yup.string().trim().required('Last name is required'),
  email: yup.string(),
  password: yup.string().trim(),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm Password do not match'
    ),
})
const mapStateToProps = (state: iRootState) => ({
  auth: state.auth,
})
const mapActionToProps = {
  logoutUser,
}

export default connect(mapStateToProps, mapActionToProps)(AccountOptionMenu)
