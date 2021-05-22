import { useEffect, useRef, useState } from 'react'
import useSWR, { trigger } from 'swr'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { AddCircle, Close, RemoveCircle } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'
import Slider from 'react-slick'

import { axiosInstance, Snackbar } from '@lib'
import { pesoFormat } from '@components'
import useStyles from '@styles/components/tableStyles'
import productStyle from '@styles/components/viewProduct'

const ViewProduct = (props: iViewProduct) => {
  const { data: productApi, isValidating } = useSWR(
    props.open ? '/api/shop/product/' + props.id : null,
    { refreshInterval: 0 }
  )
  const [nav1, setNav1] = useState<any | null>()
  const [nav2, setNav2] = useState<any | null>()
  const slider1 = useRef(null)
  const slider2 = useRef(null)

  const [quantity, setQuantity] = useState(1)
  const incrementQty = () => {
    setQuantity(quantity + 1)
  }
  const decrementQty = () => {
    if (quantity <= 1) {
      setQuantity(1)
    } else {
      setQuantity(quantity - 1)
    }
  }

  useEffect(() => {
    return () => {
      setQuantity(1)
    }
  }, [])

  const [apiRequest, setApiRequest] = useState(false)
  const addToCart = async (data: iData) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/cart/product', data)
      const res = await req.data
      trigger('/api/cart/count')
      Snackbar.info(res.msg)
      props.eventHandler()
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }
  const handleClickAddToCart = async (id: number) => {
    const data = { id, quantity }
    await addToCart(data)
  }

  const classes = useStyles()
  const style = productStyle()
  return (
    <>
      <Dialog
        maxWidth="md"
        open={props.open}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            View Product
            <IconButton
              onClick={props.eventHandler}
              className={classes.btnClose}
            >
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
                  <Skeleton animation="wave" height={250} />
                  <Grid container>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={30} animation="wave" />
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton width={120} height={30} animation="wave" />
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Paper variant="outlined">
                    {productApi?.productImage.lenth <= 0 ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <Slider
                          asNavFor={nav2}
                          className={style.slider}
                          ref={(slider1) => setNav1(slider1)}
                        >
                          {productApi?.productImage.map((item: any) => (
                            <div key={item.id}>
                              <div className={style.sliderImgContainer}>
                                <img
                                  src={item.secure_url}
                                  alt={productApi?.name}
                                  className={style.sliderImg}
                                />
                              </div>
                            </div>
                          ))}
                        </Slider>
                        {productApi?.productImage.length > 1 && (
                          <Slider
                            asNavFor={nav1}
                            ref={(slider2) => setNav2(slider2)}
                            slidesToShow={3}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            arrows={false}
                            infinite={productApi?.productImage.length > 3}
                          >
                            {productApi?.productImage.map((item: any) => (
                              <div key={item.id}>
                                <div className={style.sliderImgContainer}>
                                  <img
                                    src={item.secure_url}
                                    alt={productApi?.name}
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
                      {productApi?.name}
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
                      {productApi?.description}
                    </Typography>
                  </div>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Price:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        marginLeft={'1em'}
                      >
                        {productApi?.price ? pesoFormat(productApi?.price) : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ marginTop: '.5em' }}
                  >
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Quantity:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title="subtract quantity">
                        <IconButton
                          disabled={apiRequest}
                          onClick={decrementQty}
                        >
                          <RemoveCircle color="secondary" />
                        </IconButton>
                      </Tooltip>
                      {quantity}
                      <Tooltip title="add quantity">
                        <IconButton
                          disabled={apiRequest}
                          onClick={incrementQty}
                          className={classes.btnIncrement}
                        >
                          <AddCircle color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6} />
                    <Grid item xs={6}>
                      <LoadingButton
                        color="primary"
                        variant="contained"
                        pending={apiRequest}
                        onClick={() => handleClickAddToCart(props.id)}
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

interface iViewProduct {
  id: number
  open: boolean
  eventHandler: () => void
}

interface iData {
  id: number
  quantity: number
}

export default ViewProduct
