import { ChangeEvent, MouseEvent, useState } from 'react'
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
  Collapse,
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
  ExpandLess,
  ExpandMore,
  MenuBook,
  Redeem,
  Search,
  ShoppingCart,
} from '@material-ui/icons'

import { axiosInstance, Snackbar } from '@lib'
import { searchFilter } from '@utils'
import { pesoFormat, RippleLoading, ViewProduct } from '@components'
import { ClientLayout } from '@layouts'
import useStyles from '@styles/pages/shop'

const Client = () => {
  const { data: categoryApi } = useSWR('/api/category')
  const { data: productApi } = useSWR('/api/shop/product')
  const { data: cartCount } = useSWR('/api/cart/count')

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

  const [selectedCategory, setSelectedCategory] = useState({
    index: 0,
    name: 'All Products',
  })
  const { index, name } = selectedCategory
  const handleSelectedCategory = ({ index, name }: iSelectedCategory) => {
    setSelectedCategory({ index, name })
  }

  const filterCategory =
    name === 'All Products'
      ? productApi
      : productApi?.filter((product: any) => product.category.name === name)
  const result = !searchKeyword
    ? filterCategory
    : searchFilter(filterCategory, searchKeyword)

  const [apiRequest, setApiRequest] = useState(false)
  const addToCart = async (data: any) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/cart/product', data)
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
  const [productId, setProductId] = useState(0)
  const handleClickProduct = (id: number) => {
    setProductId(id)
    handleProductDialog()
  }

  const handleClickAddToCart = async (values: any) => {
    const data = {
      id: values.id,
      quantity: 1,
    }
    await addToCart(data)
  }

  const [listExpand, setListExpand] = useState(true)
  const handleListExpand = () => {
    setListExpand(!listExpand)
  }
  const handleClickList = (e: MouseEvent<Element, globalThis.MouseEvent>) => {
    e.stopPropagation()
    handleListExpand()
  }

  const router = useRouter()
  const ListMapping = () => {
    return (
      <>
        <ListItem
          button
          onClick={(e) => handleClickList(e)}
          className={classes.listItem}
        >
          <ListItemIcon>
            <MenuBook />
          </ListItemIcon>
          <ListItemText primary="Products" />
          {listExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={listExpand} unmountOnExit>
          <ClickAwayListener onClickAway={handleListExpand}>
            <>
              <ListItem
                button
                className={
                  index === 0 ? classes.listItemSelected : classes.listItem
                }
                selected={index === 0}
                onClick={() =>
                  handleSelectedCategory({ index: 0, name: 'All Products' })
                }
              >
                <ListItemText color="secondary" primary="All Products" />
              </ListItem>

              {categoryApi?.map((item: any) => (
                <ListItem
                  key={item.id}
                  button
                  className={
                    index === item.id + 1
                      ? classes.listItemSelected
                      : classes.listItem
                  }
                  selected={index === item.id + 1}
                  onClick={() =>
                    handleSelectedCategory({
                      index: item.id + 1,
                      name: item.name,
                    })
                  }
                >
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </>
          </ClickAwayListener>
        </Collapse>
        <Link href="/shop/package">
          <a className={classes.link}>
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                <Redeem />
              </ListItemIcon>
              <ListItemText primary="Package" />
            </ListItem>
          </a>
        </Link>
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
                <List component="nav" sx={{ padding: 0 }}>
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
                    {name}
                  </Typography>
                </Breadcrumbs>
                <IconButton onClick={() => router.push('/shop/cart')}>
                  <Badge color="secondary" badgeContent={cartCount}>
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
                {!productApi && (
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
                            image={
                              item?.productImage.length <= 0
                                ? '/noimg.jpg'
                                : item?.productImage[0].secure_url
                            }
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
                            {pesoFormat(item.price)}
                          </Typography>
                          <div>
                            <Tooltip title="add to cart">
                              <IconButton
                                edge="end"
                                disabled={apiRequest}
                                color="primary"
                                aria-label="add to shopping cart"
                                onClick={() => handleClickAddToCart(item)}
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
          sx={{ zIndex: 2000, width: '100%', position: 'fixed', top: 0 }}
        />
      )}
      <ViewProduct
        id={productId}
        open={openProductDialog}
        eventHandler={handleProductDialog}
      />
    </>
  )
}

interface iSelectedCategory {
  index: number
  name: string
}
export default Client
