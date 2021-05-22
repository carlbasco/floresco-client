import { ChangeEvent, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR, { trigger } from 'swr'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  ClickAwayListener,
  Container,
  FormControl,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
import {
  AccountBalance,
  AddShoppingCartOutlined,
  ErrorOutline,
  MenuBook,
  Redeem,
  Search,
  ShoppingCart,
} from '@material-ui/icons'

import { axiosInstance, Snackbar } from '@lib'
import { searchFilter } from '@utils'
import { pesoFormat, RippleLoading, ViewPackage } from '@components'
import { ClientLayout } from '@layouts'
import useStyles from '@styles/pages/shop'

const Package = () => {
  const { data: packageApi } = useSWR('/api/shop/package')
  const { data: cartCountApi } = useSWR('/api/cart/count')

  const [accordionExpand, setAccordionExpand] = useState(false)
  const handleAccordionExpand = () => {
    setAccordionExpand(!accordionExpand)
  }
  const handleClickAway = () => {
    setAccordionExpand(false)
  }

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const result = !searchKeyword
    ? packageApi
    : searchFilter(packageApi, searchKeyword)

  const [apiRequest, setApiRequest] = useState(false)
  const handleClickAddToCart = async (id: number) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/cart/package/' + id)
      const res = await req.data
      trigger('/api/cart/count')
      Snackbar.info(res.msg)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const [openProductDialog, setOpenProductDialog] = useState(false)
  const handleProductDialog = () => {
    setOpenProductDialog(!openProductDialog)
  }
  const [packageId, setPackageId] = useState(0)
  const handleClickProduct = (id: number) => {
    setPackageId(id)
    handleProductDialog()
  }

  const ListMapping = () => {
    return (
      <>
        <Link href="/shop">
          <a className={classes.link}>
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <MenuBook />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
          </a>
        </Link>
        <ListItem button className={classes.listItemSelected} selected>
          <ListItemIcon>
            <Redeem />
          </ListItemIcon>
          <ListItemText primary="Package" />
        </ListItem>
        <Link href="/shop/chapel">
          <a className={classes.link}>
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <AccountBalance />
              </ListItemIcon>
              <ListItemText primary="Chapel" />
            </ListItem>
          </a>
        </Link>
      </>
    )
  }

  const router = useRouter()
  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ClientLayout>
        <Container>
          <div className={classes.main}>
            <Hidden mdDown>
              <Paper className={classes.sideBar} elevation={4}>
                <List component="nav" style={{ padding: 0 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    fontWeight={600}
                    align="center"
                  >
                    Category
                  </Typography>
                  <ListMapping />
                </List>
              </Paper>
            </Hidden>
            <div className={classes.shop}>
              <Hidden mdUp>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Accordion
                    elevation={4}
                    expanded={accordionExpand}
                    className={classes.accordion}
                    onClick={handleAccordionExpand}
                    TransitionProps={{ unmountOnExit: true }}
                  >
                    <AccordionSummary className={classes.accordionSummary}>
                      <Typography
                        gutterBottom
                        align="center"
                        color="primary"
                        variant="subtitle1"
                        fontWeight={600}
                      >
                        Category
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List component="nav" className={classes.list}>
                        <ListMapping />
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ClickAwayListener>
              </Hidden>
              <div className={classes.breadcrumbCart}>
                <Breadcrumbs separator=">">
                  <Link href="/shop">
                    <a style={{ textDecoration: 'none' }}>
                      <Typography
                        className={classes.breadcrumbLink}
                        color="textPrimary"
                        variant="body1"
                      >
                        Shop
                      </Typography>
                    </a>
                  </Link>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color="secondary"
                  >
                    Package
                  </Typography>
                </Breadcrumbs>
                <IconButton onClick={() => router.push('/shop/cart')}>
                  <Badge color="secondary" badgeContent={cartCountApi}>
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </div>
              <FormControl
                fullWidth
                variant="outlined"
                size="small"
                className={classes.searchFormControl}
              >
                <OutlinedInput
                  size="small"
                  type="text"
                  placeholder="search"
                  className={classes.searchInput}
                  value={searchKeyword}
                  onChange={handleChangeSearch}
                  endAdornment={
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Grid container alignItems="center" spacing={3}>
                {!packageApi && (
                  <Grid item xs={12}>
                    <RippleLoading />
                  </Grid>
                )}
                {result?.length !== 0 ? (
                  result?.map((item: any) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card className={classes.card} elevation={4}>
                        <CardActionArea
                          onClick={() => handleClickProduct(item.id)}
                        >
                          <CardMedia
                            component="img"
                            title={item?.name}
                            className={classes.cardMedia}
                            image="/package.jpg"
                          />
                          <CardContent className={classes.cardContent}>
                            <Typography fontWeight="bold" variant="subtitle1">
                              {item.name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions className={classes.cardAction}>
                          <Typography
                            align="center"
                            variant="body2"
                            color="secondary"
                          >
                            {item?.Product.length <= 0
                              ? 'Not Available'
                              : item?.Product &&
                                pesoFormat(
                                  item?.Product.reduce(
                                    (total: number, val: any) =>
                                      total + val.price,
                                    0
                                  ) -
                                    (item?.discount / 100) *
                                      item?.Product.reduce(
                                        (total: number, val: any) =>
                                          total + val.price,
                                        0
                                      )
                                )}
                          </Typography>
                          <div>
                            <Tooltip title="add to cart">
                              <IconButton
                                edge="end"
                                disabled={apiRequest}
                                color="primary"
                                aria-label="add to shopping cart"
                                onClick={() => handleClickAddToCart(item.id)}
                              >
                                <AddShoppingCartOutlined />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <div className={classes.divNotFound}>
                      <Typography variant="h6" color="textSecondary">
                        Sorry, no result found
                      </Typography>
                      <ErrorOutline color="action" />
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          </div>
        </Container>
      </ClientLayout>
      {apiRequest && (
        <LinearProgress
          style={{ zIndex: 2000, width: '100%', position: 'fixed', top: 0 }}
        />
      )}
      <ViewPackage
        id={packageId}
        open={openProductDialog}
        eventHandler={handleProductDialog}
      />
    </>
  )
}

export default Package
