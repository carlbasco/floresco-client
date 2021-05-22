import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { LoadingButton } from '@material-ui/lab'
import { EmailOutlined, Visibility, VisibilityOff } from '@material-ui/icons'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@material-ui/core'

import { axios, Snackbar } from '@lib'
import { AuthLayout } from '@layouts'
import { iRootState } from '@redux'
import useStyles from '@styles/pages/register'
import { TermsPolicy } from '@components'

const isServer = () => typeof window === 'undefined'

const register = () => {
  const [apiRequest, setApiRequest] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: iRegisterForm) => {
    try {
      setApiRequest(true)
      const req = await axios({
        url: '/api/auth/register',
        method: 'POST',
        data,
      })
      const res = await req.data
      Snackbar.success(res.msg)
      reset({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (err) {
      if (err.response.data.msg) Snackbar.error(err.response.data.msg)
    } finally {
      setApiRequest(false)
    }
  }

  const auth = useSelector((state: iRootState) => state.auth)
  const router = useRouter()
  if (!isServer()) {
    if (auth.isAuthenticated) {
      if (auth.user.role === 'admin') router.replace('/admin')
      if (auth.user.role === 'pic') router.replace('/pic')
      if (auth.user.role === 'client') router.replace('/shop')
    }
  }

  const [openTermDialog, setOpenTermDialog] = useState(false)
  const handleTermDialog = () => {
    setOpenTermDialog(!openTermDialog)
  }
  const [openPrivacyDialog, setOpenPrivacyDialog] = useState(false)
  const handlePrivacyDialog = () => {
    setOpenPrivacyDialog(!openPrivacyDialog)
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Register - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AuthLayout>
        <div className={classes.header}>
          <Typography className={classes.title} variant="h4" align="center">
            Create an Account
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            Enter your details below
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="firstName"
            defaultValue=""
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl
                className={classes.formControl}
                fullWidth
                variant="outlined"
              >
                <InputLabel required>First Name </InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  labelWidth={97}
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
                className={classes.formControl}
                fullWidth
                variant="outlined"
              >
                <InputLabel>Middle Name</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  labelWidth={100}
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
                className={classes.formControl}
                fullWidth
                variant="outlined"
              >
                <InputLabel required>Last Name</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  labelWidth={95}
                />
                <FormHelperText error={Boolean(errors.lastName)}>
                  {errors.lastName?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
          <Controller
            name="email"
            defaultValue=""
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl
                className={classes.formControl}
                fullWidth
                variant="outlined"
              >
                <InputLabel required>Email Address</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  labelWidth={118}
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
                className={classes.formControl}
                fullWidth
                variant="outlined"
              >
                <InputLabel required>Password</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  labelWidth={80}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
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
              <FormControl fullWidth variant="outlined">
                <InputLabel required>Confirm Password</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  labelWidth={150}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
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
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.textTerms}
          >
            By entering information, I agree to Floresco Funerals &nbsp;
            <a onClick={handleTermDialog}>Terms and Condition</a> and{' '}
            <a onClick={handlePrivacyDialog}>Privacy Policy</a>
          </Typography>
          <LoadingButton
            className={classes.button}
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            pending={apiRequest}
          >
            Register
          </LoadingButton>
        </form>
        <div className={classes.loginFooter}>
          <Typography variant="subtitle2" color="textSecondary" align="center">
            Already have an account? &nbsp;
            <Link href="/login">
              <a className={classes.registerLink}>Login</a>
            </Link>
            &nbsp; here
          </Typography>
        </div>
        <TermsPolicy.Policy
          open={openPrivacyDialog}
          eventHandler={handlePrivacyDialog}
        />
        <TermsPolicy.Terms
          open={openTermDialog}
          eventHandler={handleTermDialog}
        />
      </AuthLayout>
    </>
  )
}

interface iRegisterForm {
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
  email: yup
    .string()
    .email('must be a valid Email Address')
    .required('Email is required'),
  password: yup
    .string()
    .trim()
    .min(6, 'Password must be atleast 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm Password do not match'
    ),
})

export default register
