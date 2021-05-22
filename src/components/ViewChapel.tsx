import { useRef, useState } from 'react'
import useSWR, { trigger } from 'swr'
import Slider from 'react-slick'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@material-ui/core'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import { DateRange } from '@material-ui/lab/DateRangePicker/RangeTypes'
import { Close } from '@material-ui/icons'
import { LoadingButton, MobileDateRangePicker } from '@material-ui/lab'

import { pesoFormat } from '@components'
import useStyles from '@styles/components/tableStyles'
import productStyle from '@styles/components/viewProduct'
import { axiosInstance, Snackbar } from '@lib'

const ViewChapel = (props: iViewDialogProps) => {
  const { data: chapelApi, isValidating } = useSWR(
    props.open ? '/api/shop/chapel/' + props.id : null,
    { refreshInterval: 0 }
  )
  const [date, setDate] = useState<DateRange<Date>>([null, null])
  const [nav1, setNav1] = useState<any | null>()
  const [nav2, setNav2] = useState<any | null>()
  const slider1 = useRef(null)
  const slider2 = useRef(null)

  const handleClose = () => {
    setDate([null, null])
    props.eventHandler()
  }

  const [apiRequest, setApiRequest] = useState(false)
  const handleAddToCart = async (id: number) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/cart/reservation', { id, date })
      const res = await req.data
      trigger('/api/cart/count')
      Snackbar.info(res.msg)
      handleClose()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const classes = useStyles()
  const style = productStyle()
  return (
    <>
      <Dialog
        maxWidth="md"
        open={props.open}
        PaperProps={{ style: { margin: '.5em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            View Chapel
            <IconButton onClick={handleClose} className={classes.btnClose}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={style.dialogContent}>
            {isValidating ? (
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Skeleton
                    variant="rectangular"
                    className={style.skeletonSliderImg}
                    animation="wave"
                  />
                  <div className={style.skeletonSliderBottom}>
                    <Skeleton variant="rectangular" animation="wave" />
                    <Skeleton variant="rectangular" animation="wave" />
                    <Skeleton variant="rectangular" animation="wave" />
                  </div>
                </Grid>
                <Grid item xs={12} md={5} className={style.productMain}>
                  <Skeleton height={50} />
                  <Skeleton animation="wave" height={220} />
                  <Grid container>
                    <Grid item xs={12}>
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={60} animation="wave" />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={60} animation="wave" />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Paper variant="outlined">
                    {chapelApi?.chapelImage.length <= 0 ? (
                      <Slider
                        asNavFor={nav2}
                        className={style.slider}
                        ref={(slider1) => setNav1(slider1)}
                      >
                        <div className={style.sliderImgContainer}>
                          <img
                            src="/noimg.jpg"
                            alt="no image"
                            className={style.sliderImg}
                          />
                        </div>
                      </Slider>
                    ) : (
                      <>
                        <Slider
                          asNavFor={nav2}
                          className={style.slider}
                          ref={(slider1) => setNav1(slider1)}
                        >
                          {chapelApi?.chapelImage.map((item: any) => (
                            <div key={item.id}>
                              <div className={style.sliderImgContainer}>
                                <img
                                  src={item.secure_url}
                                  alt={chapelApi?.name}
                                  className={style.sliderImg}
                                />
                              </div>
                            </div>
                          ))}
                        </Slider>
                        {chapelApi?.chapelImage.length > 1 && (
                          <Slider
                            asNavFor={nav1}
                            ref={(slider2) => setNav2(slider2)}
                            slidesToShow={3}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            arrows={false}
                            infinite={chapelApi?.chapelImage.length > 3}
                          >
                            {chapelApi?.chapelImage.map((item: any) => (
                              <div key={item.id}>
                                <div className={style.sliderImgContainer}>
                                  <img
                                    src={item.secure_url}
                                    alt={chapelApi?.name}
                                    className={style.sliderImgSM}
                                  />
                                </div>
                              </div>
                            ))}
                          </Slider>
                        )}
                      </>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={5} className={style.productMain}>
                  <div className={style.productMB}>
                    <Typography variant="h5" align="center" fontWeight={700}>
                      {chapelApi?.name}
                    </Typography>
                  </div>
                  <div className={style.productMB}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      Description:
                    </Typography>
                    <Typography variant="body1" align="justify">
                      {chapelApi?.description}
                    </Typography>
                  </div>
                  <Grid container>
                    <Grid item xs={12} sx={{ display: 'inline-flex' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Price per day:&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {chapelApi?.price && pesoFormat(chapelApi?.price)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '1em' }}>
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
                                {...startProps}
                                variant="outlined"
                                label="Start date"
                                size="small"
                              />
                              <Box sx={{ mx: 2 }}> to </Box>
                              <TextField
                                {...endProps}
                                variant="outlined"
                                label="End date"
                                size="small"
                              />
                            </>
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '1em' }}>
                      <LoadingButton
                        color="primary"
                        variant="contained"
                        pending={apiRequest}
                        onClick={() => handleAddToCart(chapelApi?.id)}
                      >
                        Add to Cart
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
interface iViewDialogProps {
  id: number
  open: boolean
  eventHandler: () => void
}

export default ViewChapel
