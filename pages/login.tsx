import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSnackbar } from 'notistack'
import { LoadingButton } from '@material-ui/lab'
import { EmailOutlined, Visibility, VisibilityOff } from '@material-ui/icons'
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@material-ui/core'

import { AuthLayout } from '@layouts'
import { axios, Snackbar } from '@lib'
import { authLogin, iAuthState, iLogin, iRootState } from '@redux'
import useStyles from '@styles/pages/login'

const isServer = () => typeof window === 'undefined'

const login = ({ auth, authLogin }: iProps) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  })
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const router = useRouter()
  if (!isServer()) {
    if (auth.isAuthenticated) {
      if (auth.user.role === 'admin') router.replace('/admin')
      if (auth.user.role === 'pic') router.replace('/pic')
      if (auth.user.role === 'client') router.replace('/shop')
    }
  }

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const sendEmailVerification = async (email: string) => {
    try {
      closeSnackbar()
      setIsDisabled(true)
      const res = await axios.post('/api/auth/activation', { email })
      if (res.data.msg) {
        Snackbar.success(res.data.msg)
        reset({ email: '', password: '' })
        setIsDisabled(false)
      }
    } catch (err) {
      Snackbar.error(err.response.data.msg)
      setIsDisabled(false)
    }
  }
  const action = () => (
    <>
      <Button
        style={{ margin: '0 .5em' }}
        color="inherit"
        variant="outlined"
        size="small"
        onClick={() => {
          sendEmailVerification(getValues('email'))
        }}
      >
        Verify Now?
      </Button>
    </>
  )

  const onSubmit = async (data: iForm) => {
    const res = await authLogin(data)
    if (res) {
      if (res.verified === false) {
        enqueueSnackbar(res.msg, {
          variant: 'warning',
          autoHideDuration: 10000,
          action,
        })
      }
    }
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Login - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AuthLayout>
        <div className={classes.header}>
          <Typography className={classes.title} variant="h4">
            Login to
          </Typography>
          <Typography className={classes.title} variant="h4" gutterBottom>
            Floresco Funerals
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Enter your details below
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange } }) => (
              <FormControl
                className={classes.formControl}
                fullWidth
                variant="outlined"
              >
                <InputLabel>Email Address</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  labelWidth={110}
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
              <FormControl fullWidth variant="outlined">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
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
                  label="Password"
                />
                <FormHelperText error={Boolean(errors.password)}>
                  {errors.password?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
          <div className={classes.loginBottom}>
            <Link href="/forgotpassword">
              <a className={classes.link}>
                <Typography variant="subtitle2">Forgot Password?</Typography>
              </a>
            </Link>
          </div>
          <LoadingButton
            fullWidth
            disabled={isDisabled ? true : false}
            type="submit"
            size="large"
            variant="contained"
            pending={auth.fetchRequest}
          >
            Login
          </LoadingButton>
        </form>
        <div className={classes.loginFooter}>
          <Typography variant="subtitle2" color="textSecondary" align="center">
            Dont have an account? &nbsp;
            <Link href="/register">
              <a className={classes.registerLink}>Register</a>
            </Link>
            &nbsp; now
          </Typography>
        </div>
      </AuthLayout>
    </>
  )
}
interface iProps {
  auth: iAuthState
  authLogin: (data: iLogin) => Promise<any>
}
interface iForm {
  email: string
  password: string
}
const schema = yup.object().shape({
  email: yup
    .string()
    .email('must be a valid Email Address')
    .required('Email is required'),
  password: yup.string().trim().required('Password is required'),
})
const mapState = (state: iRootState) => ({
  auth: state.auth,
})
const mapActionToProps = {
  authLogin,
}

export default connect(mapState, mapActionToProps)(login)
