import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@material-ui/lab'
import { Visibility, VisibilityOff } from '@material-ui/icons'
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
import { iRootState } from '@redux'
import { AuthLayout } from '@layouts'
import useStyles from '@styles/pages/resetPassword'

const isServer = () => typeof window === 'undefined'

const ForgotPassword = () => {
  const [apiRequest, setApiRequest] = useState(false)
  const router = useRouter()
  const { token } = router.query

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: iForm) => {
    setApiRequest(true)
    try {
      const res = await axios({
        url: `/api/auth/reset-password/${token}`,
        method: 'POST',
        data,
      })
      Snackbar.success(res.data.msg)
      reset({ password: '', confirmPassword: '' })
      router.replace('/login')
    } catch (err) {
      Snackbar.error(err.response.data.msg)
    } finally {
      setApiRequest(false)
    }
  }

  const auth = useSelector((state: iRootState) => state.auth)
  if (!isServer()) {
    if (auth.isAuthenticated) {
      if (auth.user.role === 'admin') router.replace('/admin')
      if (auth.user.role === 'pic') router.replace('/pic')
      if (auth.user.role === 'client') router.replace('/shop')
    }
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Reset Password - Floreesco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AuthLayout>
        <div className={classes.header}>
          <Typography variant="h4" className={classes.title} gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Enter your desired password
          </Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
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
          <LoadingButton
            className={classes.button}
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            pending={apiRequest}
          >
            Submit
          </LoadingButton>
        </form>
      </AuthLayout>
    </>
  )
}

interface iForm {
  password: string
  confirmPassword: string
}

const schema = yup.object().shape({
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

export default ForgotPassword
