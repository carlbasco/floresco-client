import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useSWR from 'swr'
import {
  Breadcrumbs,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { EmailOutlined, Visibility, VisibilityOff } from '@material-ui/icons'

import { axiosInstance, Snackbar } from '@lib'
import { CloudLoading } from '@components'
import { AdminLayout } from '@layouts'
import useStyles from '@styles/pages/accounts/formAccount'

const NewAccount = () => {
  const { data: roleApi } = useSWR('/api/option/role', {
    refreshInterval: 0,
  })

  const [apiRequest, setApiRequest] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: iAccountForm) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance({
        url: '/api/account',
        method: 'POST',
        data: data,
      })
      const res = await req.data
      Snackbar.success(res.msg)
      reset({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      })
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
        <title>Create Account - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout index={4}>
        <div>
          <Breadcrumbs separator=">">
            <Link href="/admin">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  color="textPrimary"
                  variant="body1"
                  className={classes.breadcrumbLink}
                >
                  Dashboard
                </Typography>
              </a>
            </Link>
            <Link href="/admin/accounts">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  className={classes.breadcrumbLink}
                >
                  Accounts
                </Typography>
              </a>
            </Link>
            <Typography color="textSecondary" variant="body1">
              New
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="primary" fontWeight="600">
            Create Account
          </Typography>
        </div>
        <Container maxWidth="lg" className={classes.root}>
          <Paper elevation={19} className={classes.paper}>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              fontWeight={700}
            >
              Enter details below
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignContent="center"
              >
                <Grid item xs={12}>
                  <Typography variant="body2" color="primary">
                    Personal Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    defaultValue=""
                    name="firstName"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel required>First Name </InputLabel>
                        <OutlinedInput
                          value={value}
                          labelWidth={97}
                          onChange={(e) => onChange(e.target.value)}
                        />
                        <FormHelperText error={Boolean(errors.firstName)}>
                          {errors.firstName?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    defaultValue=""
                    name="middleName"
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
                          labelWidth={100}
                          onChange={(e) => onChange(e.target.value)}
                        />
                        <FormHelperText error={Boolean(errors.middleName)}>
                          {errors.middleName?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
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
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="primary">
                    Account Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="role"
                    defaultValue=""
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel required>Role</InputLabel>
                        <Select
                          labelWidth={50}
                          onChange={onChange}
                          value={value ? value : ''}
                        >
                          <MenuItem value="">
                            <em>----------</em>
                          </MenuItem>
                          {roleApi?.map((item: any) => (
                            <MenuItem key={item.id} value={item.value}>
                              {item.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                        <InputLabel required>Password</InputLabel>
                        <OutlinedInput
                          value={value}
                          labelWidth={80}
                          onChange={(e) => onChange(e.target.value)}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={handleClickShowPassword}
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
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
                </Grid>
                <Grid item xs={12} md={6}>
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
                </Grid>
                <Grid item xs={12} md={8}>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    size="large"
                    variant="contained"
                    pending={apiRequest}
                    className={classes.button}
                  >
                    Create Account
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
        <CloudLoading open={apiRequest} animation="upload" />
      </AdminLayout>
    </>
  )
}

interface iAccountForm {
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
  role: yup.string().required(),
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

export default NewAccount
