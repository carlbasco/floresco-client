import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

import useStyles from '@styles/components/contractDialog'
import { axiosInstance, Snackbar } from '@lib'
import { CloudLoading, PhoneNumberFormat } from '@components'
import { LoadingButton } from '@material-ui/lab'
import { trigger } from 'swr'

const ContractDialog = ({ open, eventHandler, contract }: iProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (contract) {
      setValue('name', contract?.ContractDetails?.name)
      setValue('address', contract?.ContractDetails?.address)
      setValue('deceased', contract?.ContractDetails?.deceased)
      setValue('phoneNumber', contract?.ContractDetails?.phoneNumber)
      setValue('placeBurial', contract?.ContractDetails?.placeBurial)
      setValue('status', contract?.status)
      setValue('paymentStatus', contract?.paymentStatus)
    }
  }, [contract])

  const [apiRequest, setApiRequest] = useState(false)

  const onSubmit = async (data: any) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.put(
        '/api/contracts/update/' + contract.id,
        data
      )
      const res = await req.data
      trigger('/api/contract/' + contract.id)
      Snackbar.success(res.msg)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
      eventHandler()
    }
  }
  const classes = useStyles()
  return (
    <>
      <Dialog maxWidth="sm" open={open} onClose={eventHandler}>
        <DialogTitle>
          Edit Contract
          <IconButton onClick={eventHandler} className={classes.btnClose}>
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
              <InputLabel> Name </InputLabel>
              <Controller
                name="name"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <OutlinedInput
                    value={value}
                    labelWidth={45}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
              />
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel required> Address </InputLabel>
              <Controller
                name="address"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <OutlinedInput
                      rows={3}
                      multiline
                      value={value}
                      labelWidth={75}
                      onChange={(e) => onChange(e.target.value)}
                    />
                    <FormHelperText error={Boolean(errors.address)}>
                      {errors.address?.message}
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
              <InputLabel required> Phone Number </InputLabel>
              <Controller
                name="phoneNumber"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <OutlinedInput
                      value={value}
                      labelWidth={140}
                      onChange={(e) => onChange(e.target.value)}
                      inputComponent={PhoneNumberFormat as any}
                    />
                    <FormHelperText error={Boolean(errors.phoneNumber)}>
                      {errors.phoneNumber?.message}
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
              <InputLabel required> Deceased Name </InputLabel>
              <Controller
                name="deceased"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <OutlinedInput
                      value={value}
                      labelWidth={140}
                      onChange={(e) => onChange(e.target.value)}
                    />
                    <FormHelperText error={Boolean(errors.deceased)}>
                      {errors.deceased?.message}
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
              <InputLabel required> Place Burial </InputLabel>
              <Controller
                name="placeBurial"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <OutlinedInput
                      rows={3}
                      multiline
                      value={value}
                      labelWidth={105}
                      onChange={(e) => onChange(e.target.value)}
                    />
                    <FormHelperText error={Boolean(errors.placeBurial)}>
                      {errors.placeBurial?.message}
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
              <InputLabel required>Contract Status</InputLabel>
              <Controller
                name="status"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <Select value={value} onChange={onChange} labelWidth={135}>
                      <MenuItem value="">---------</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="ongoing">On Going</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="canceled">Canceled</MenuItem>
                    </Select>
                    <FormHelperText error={Boolean(errors.status)}>
                      {errors.status?.message}
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
              <InputLabel required>Payment Status</InputLabel>
              <Controller
                name="paymentStatus"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <Select value={value} onChange={onChange} labelWidth={135}>
                      <MenuItem value="">---------</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                    </Select>
                    <FormHelperText error={Boolean(errors.paymentStatus)}>
                      {errors.paymentStatus?.message}
                    </FormHelperText>
                  </>
                )}
              />
            </FormControl>
            <LoadingButton
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              pending={apiRequest}
              sx={{ marginBottom: '1em' }}
            >
              Update Contract
            </LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      <CloudLoading open={apiRequest} animation="upload" />
    </>
  )
}

interface iProps {
  open: boolean
  eventHandler: () => void
  contract: any
}

const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  phoneNumber: yup.string().trim().required('Contact number is required'),
  address: yup.string().trim().required('Address is required'),
  deceased: yup.string().trim().required('Deceased is required'),
  placeBurial: yup.string().trim().required('Place Burial is required'),
  status: yup.string().required('Status is required'),
  paymentStatus: yup.string().required('Payment Status is required'),
})

export default ContractDialog
