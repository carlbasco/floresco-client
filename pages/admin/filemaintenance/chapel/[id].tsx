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

const Chapel = ({ chapel, error }: iProps) => {
  const router = useRouter()
  const { id } = router.query
  if (error === true) return <ErrorPage />

  const { data: chapelApi, isValidating } = useSWR('/api/chapel/' + id, {
    initialData: chapel,
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
        <title>{chapelApi?.name}</title>
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
              Chapel
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="primary">
            View Chapel
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
              <Grid container alignItems="center">
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
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Status:
                      </Typography>
                      {chapelApi?.isHidden ? (
                        <SpanBadge label="Hidden" variant="error" />
                      ) : (
                        <SpanBadge label="Visible" variant="success" />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Price per day:
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {chapelApi?.price && pesoFormat(chapelApi?.price)}
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
    const chapel = await fetcher('/api/chapel/' + id)
    const error = false
    return { props: { chapel, error } }
  } catch (err) {
    const chapel = null
    const error = true
    return { props: { chapel, error } }
  }
}

interface iProps {
  chapel: any
  error: boolean
}

export default Chapel
