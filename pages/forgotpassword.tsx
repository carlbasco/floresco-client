import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@material-ui/lab'
import { EmailOutlined } from '@material-ui/icons'
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@material-ui/core'

import { axios, Snackbar } from '@lib'
import { AuthLayout } from '@layouts'
import { iRootState } from '@redux'
import useStyles from '@styles/pages/forgotPassword'

const isServer = () => typeof window === 'undefined'

const login = () => {
  const [apiRequest, setApiRequest] = useState(false)
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: iForm) => {
    try {
      setApiRequest(true)
      const res = await axios.post('/api/auth/forgot-password', {
        email: data.email,
      })
      Snackbar.success(res.data.msg)
      reset({ email: '' })
    } catch (err) {
      Snackbar.error(err.response.data.msg)
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

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Forgot Password - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AuthLayout>
        <div className={classes.header}>
          <Typography variant="h4" className={classes.title} gutterBottom>
            Forgot Password?
          </Typography>
          <Typography variant="body1" gutterBottom color="textSecondary">
            Don't worry, just fill in your email and we'll send you a link to
            reset your password
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <EmailOutlined />
                    </InputAdornment>
                  }
                  label="Email"
                />
                <FormHelperText error={Boolean(errors.email)}>
                  {errors.email?.message}
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
        <div className={classes.formFooter}>
          <Typography variant="subtitle2" color="textSecondary" align="center">
            Go back to &nbsp;
            <Link href="/login">
              <a className={classes.registerLink}>Login</a>
            </Link>
          </Typography>
        </div>
      </AuthLayout>
    </>
  )
}

interface iForm {
  email: string
}
const schema = yup.object().shape({
  email: yup
    .string()
    .email('must be a valid Email Address')
    .required('Email is required'),
})

export default login
