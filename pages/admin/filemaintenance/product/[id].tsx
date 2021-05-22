import { useRef, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import ErrorPage from '../../../404'

import Slider from 'react-slick'
import {
  Typography,
  Container,
  Breadcrumbs,
  Grid,
  Skeleton,
  Paper,
} from '@material-ui/core'
import { AdminLayout } from '@layouts'
import { fetcher } from '@lib'

import productStyle from '@styles/components/viewProduct'
import useStyles from '@styles/pages/product'
import { pesoFormat, SpanBadge } from '@components'

const Product = ({ product, error }: iProps) => {
  const router = useRouter()
  const { id } = router.query
  if (error === true) return <ErrorPage />

  const { data: productApi, isValidating } = useSWR('/api/product/' + id, {
    initialData: product,
  })

  const [nav1, setNav1] = useState<any | null>()
  const [nav2, setNav2] = useState<any | null>()
  const slider1 = useRef(null)
  const slider2 = useRef(null)

  const classes = useStyles()
  const style = productStyle()
  return (
    <>
      <Head>
        <title>{productApi?.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout index={3}>
        <div>
          <Breadcrumbs separator=">">
            <Link href="/admin">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  className={classes.breadcrumbLink}
                  color="textPrimary"
                  variant="body1"
                >
                  Dashboard
                </Typography>
              </a>
            </Link>
            <Link href="/admin/filemaintenance">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  className={classes.breadcrumbLink}
                  color="textPrimary"
                  variant="body1"
                >
                  File Maintenance
                </Typography>
              </a>
            </Link>
            <Typography color="textSecondary" variant="body1">
              Product
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="primary">
            View Product
          </Typography>
        </div>
        <Container maxWidth="md" className={classes.container}>
          <Paper elevation={4} className={classes.paper}>
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
                      <Skeleton
                        width={120}
                        height={30}
                        animation="wave"
                        sx={{ marginBottom: '1em' }}
                      />
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton
                        width={120}
                        height={30}
                        animation="wave"
                        sx={{ marginBottom: '1em' }}
                      />
                      <Skeleton width={120} height={30} animation="wave" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid container alignItems="center">
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
                    <Grid item xs={6} sx={{ marginBottom: '1em' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Status:
                      </Typography>
                      {productApi?.isHidden ? (
                        <SpanBadge label="Hidden" variant="error" />
                      ) : (
                        <SpanBadge label="Visible" variant="success" />
                      )}
                    </Grid>
                    <Grid item xs={6} sx={{ marginBottom: '1em' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Price:
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {productApi?.price ? pesoFormat(productApi?.price) : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Package:
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {productApi?.package !== null
                          ? productApi?.package.name
                          : 'None'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Container>
      </AdminLayout>
    </>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id
  try {
    const product = await fetcher('/api/product/' + id)
    const error = false
    return { props: { product, error } }
  } catch (err) {
    const product = null
    const error = true
    return { props: { product, error } }
  }
}

interface iProps {
  product: any
  error: boolean
}

export default Product
