import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import { DateRange } from '@material-ui/lab/DateRangePicker/RangeTypes'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { LoadingButton, MobileDateRangePicker } from '@material-ui/lab'

import useStyles from '@styles/pages/schedule'
import { axiosInstance, Snackbar } from '@lib'
import useSWR, { trigger } from 'swr'

export const Update = ({ open, eventHandler, id }: iProps) => {
  const { data: chapel } = useSWR('/api/chapel')
  const { data: scheduleApi } = useSWR(open ? '/api/schedule/' + id : '')
  const [date, setDate] = useState<DateRange<Date>>([null, null])
  const [apiRequest, setApiRequest] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (scheduleApi) {
      setValue(
        'chapelId',
        !scheduleApi?.reservation.chapel?.id
          ? ''
          : scheduleApi?.reservation.chapel?.id
      )
    }
  }, [scheduleApi])

  const onSubmit = async (data: any) => {
    try {
      setApiRequest(true)
      const { chapelId } = data
      const req = await axiosInstance.put('/api/schedule/' + id, {
        chapelId,
        date,
      })
      const res = await req.data
      Snackbar.success(res.msg)
      trigger('/api/schedules/list')
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
      <Dialog open={open} onClose={eventHandler}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Edit Reservation</DialogTitle>
          <DialogContent>
            {!scheduleApi ? (
              <div
                style={{
                  margin: '2em 6em',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <>
                {scheduleApi?.reservation.contract?.id && (
                  <Typography
                    color="secondary"
                    variant="subtitle2"
                    sx={{ marginBottom: '1em' }}
                  >
                    Contract #{scheduleApi?.reservation.contract.id}
                  </Typography>
                )}
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ marginBottom: '1em' }}
                >
                  <InputLabel required>Chapel</InputLabel>
                  <Controller
                    name="chapelId"
                    defaultValue=""
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Select
                          value={value}
                          onChange={onChange}
                          labelWidth={70}
                          size="small"
                        >
                          <MenuItem value="">---------</MenuItem>
                          {chapel &&
                            chapel.map((item: any) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText error={Boolean(errors.chapelId)}>
                          {errors.chapelId?.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDateRangePicker
                    startText="Mobile start"
                    disablePast
                    value={date}
                    onChange={(date) => {
                      setDate(date)
                    }}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField
                          required
                          size="small"
                          {...startProps}
                          variant="outlined"
                          label="Start date"
                        />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField
                          required
                          size="small"
                          {...endProps}
                          variant="outlined"
                          label="End date"
                        />
                      </>
                    )}
                  />
                </LocalizationProvider>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={apiRequest}
              onClick={eventHandler}
              className={classes.btnCancel}
            >
              Cancel
            </Button>
            {scheduleApi && (
              <LoadingButton
                autoFocus
                type="submit"
                color="primary"
                pending={apiRequest}
              >
                Update Reservation
              </LoadingButton>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export const Delete = ({ open, id, eventHandler }: iProps) => {
  const [apiRequest, setApiRequest] = useState(false)
  const deleteReservation = async () => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.delete('/api/schedule/' + id)
      const res = await req.data
      Snackbar.success(res.msg)
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
      <Dialog open={open} onClose={eventHandler}>
        <DialogTitle>Delete Reservation?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this reservation?
        </DialogContent>
        <DialogActions>
          <Button
            disabled={apiRequest}
            onClick={eventHandler}
            className={classes.btnCancel}
          >
            Cancel
          </Button>
          <LoadingButton
            autoFocus
            pending={apiRequest}
            onClick={deleteReservation}
            className={classes.btnDelete}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface iProps {
  open: boolean
  eventHandler: () => void
  id: number
}

const schema = yup.object().shape({
  chapelId: yup.string().required('Chapel is required'),
})

export default { Update, Delete }
