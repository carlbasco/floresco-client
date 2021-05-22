import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useSWR from 'swr'
import { LoadingButton } from '@material-ui/lab'
import { EmailOutlined, Visibility, VisibilityOff } from '@material-ui/icons'
import {
  Breadcrumbs,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
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

import { AdminLayout } from '@layouts'
import { axiosInstance, Snackbar } from '@lib'
import { CloudLoading } from '@components'
import useStyles from '@styles/pages/accounts/formAccount'

const NewAccount = () => {
  const { data: roleApi } = useSWR('/api/option/role', {
    refreshInterval: 0,
  })
  const router = useRouter()
  const { id } = router.query
  const { data: userApi, isValidating } = useSWR('/api/account/' + id)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (userApi) {
      const { firstName, middleName, lastName, email, role, isActive } = userApi
      if (middleName !== null || undefined) {
        setValue('middleName', middleName)
      }
      setValue('email', email)
      setValue('firstName', firstName)
      setValue('lastName', lastName)
      setValue('role', role)
      setValue('isActive', isActive)
    }
  }, [userApi])

  const [apiRequest, setApiRequest] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: iAccountForm) => {
    const { email, ...formData } = data
    try {
      setApiRequest(true)
      const req = await axiosInstance({
        url: '/api/account/' + id,
        method: 'PUT',
        data: formData,
      })
      const res = await req.data
      Snackbar.success(res.msg)
      router.push('/admin/accounts')
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
        <title>Edit Account - Floresco Funeral</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout index={4}>
        <div>
          <Breadcrumbs separator=">">
            <Link href="/admin">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
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
              Edit
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="primary" fontWeight="600">
            Modify Account
          </Typography>
        </div>
        <Container maxWidth="lg" className={classes.root}>
          <Paper elevation={19} className={classes.paper}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {!userApi ? (
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
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="primary">
                      Account Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item md={9}></Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton
                      height={56}
                      variant="rectangular"
                      className={classes.skeleton}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <LoadingButton
                      disabled
                      fullWidth
                      type="submit"
                      size="large"
                      variant="contained"
                      className={classes.button}
                    >
                      Update Account
                    </LoadingButton>
                  </Grid>
                </Grid>
              ) : (
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
                          className={classes.formControl}
                          fullWidth
                          variant="outlined"
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
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <FormLabel>Status</FormLabel>
                      <Controller
                        defaultValue=""
                        name="isActive"
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
                              label="Active"
                              control={<Radio color="primary" />}
                            />
                            <FormControlLabel
                              value={false}
                              label="Not Active"
                              control={<Radio color="primary" />}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                      defaultValue=""
                      name="password"
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
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
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
                      defaultValue=""
                      control={control}
                      name="confirmPassword"
                      render={({ field: { value, onChange } }) => (
                        <FormControl
                          fullWidth
                          variant="outlined"
                          className={classes.formControl}
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
                          <FormHelperText
                            error={Boolean(errors.confirmPassword)}
                          >
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
                      className={classes.button}
                      disabled={isValidating ? true : false}
                      pending={apiRequest}
                    >
                      Update Account
                    </LoadingButton>
                  </Grid>
                </Grid>
              )}
            </form>
          </Paper>
        </Container>
        <CloudLoading open={isValidating ? true : false} animation="download" />
        <CloudLoading open={apiRequest} animation="upload" />
      </AdminLayout>
    </>
  )
}

const schema = yup.object().shape({
  firstName: yup.string().trim().required('First name is required'),
  middleName: yup.string().trim(),
  lastName: yup.string().trim().required('Last name is required'),
  email: yup.string(),
  role: yup.string().required(),
  password: yup.string().trim(),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm Password do not match'
    ),
  isActive: yup.boolean(),
})

interface iAccountForm {
  firstName: string
  middleName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  isActive: boolean
}

export default NewAccount
