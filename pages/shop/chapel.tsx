import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Typography,
} from '@material-ui/core'
import {
  AccountBalance,
  ErrorOutline,
  MenuBook,
  Redeem,
  Search,
  ShoppingCart,
} from '@material-ui/icons'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import { pesoFormat, RippleLoading, ViewChapel } from '@components'
import { searchFilter } from '@utils'
import { ClientLayout } from '@layouts'
import useStyles from '@styles/pages/shop'

const Chapel = () => {
  const { data: chapelApi } = useSWR('/api/shop/chapel')
  const { data: schedApi } = useSWR('/api/schedule')
  const { data: cartCountApi } = useSWR('/api/cart/count')

  const localizer = momentLocalizer(moment)
  const [categoryExpand, setCategoryExpand] = useState(false)
  const handleCategoryExpand = () => {
    setCategoryExpand(!categoryExpand)
  }
  const handleClickAwayCategory = () => {
    setCategoryExpand(false)
  }
  const [scheduleExpand, setScheduleExpand] = useState(false)
  const handleScheduleExpand = () => {
    setScheduleExpand(!scheduleExpand)
  }
  const handleClickAwaySchedule = () => {
    setScheduleExpand(false)
  }
  const handleClickSchedule = (
    e: MouseEvent<Element, globalThis.MouseEvent>
  ) => {
    e.stopPropagation()
  }

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }
  const result = !searchKeyword
    ? chapelApi
    : searchFilter(chapelApi, searchKeyword)

  const [openChapelDialog, setOpenChapelDialog] = useState(false)
  const handleChapelDialog = () => {
    setOpenChapelDialog(!openChapelDialog)
  }
  const [chapelId, setChapelId] = useState(0)
  const handleClickProduct = (id: number) => {
    setChapelId(id)
    handleChapelDialog()
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
        <ListItem button className={classes.listItemSelected} selected>
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText primary="Chapel" />
        </ListItem>
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
              <div>
                <Paper className={classes.sideBarChapel} elevation={4}>
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
                <Paper elevation={4} className={classes.paperCalendar}>
                  <Typography
                    gutterBottom
                    fontWeight={600}
                    align="center"
                    color="inherit"
                    variant="subtitle1"
                  >
                    Reservation Schedule
                  </Typography>
                  <Calendar
                    localizer={localizer}
                    views={['month', 'agenda']}
                    defaultView="agenda"
                    className={classes.calendar}
                    events={!schedApi ? [] : schedApi}
                    components={{
                      agenda: {
                        event: EventAgenda,
                      },
                    }}
                  />
                </Paper>
              </div>
            </Hidden>
            <div className={classes.shop}>
              <Hidden mdUp>
                <ClickAwayListener onClickAway={handleClickAwayCategory}>
                  <Accordion
                    elevation={4}
                    expanded={categoryExpand}
                    className={classes.accordion}
                    onClick={handleCategoryExpand}
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
                <div>
                  <ClickAwayListener onClickAway={handleClickAwaySchedule}>
                    <Accordion
                      elevation={4}
                      expanded={scheduleExpand}
                      className={classes.accordion}
                      onClick={handleScheduleExpand}
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
                          Reservation Schedule
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails onClick={(e) => handleClickSchedule(e)}>
                        <Calendar
                          defaultView="agenda"
                          localizer={localizer}
                          views={['month', 'agenda']}
                          className={classes.calendar}
                          events={!schedApi ? [] : schedApi}
                          components={{
                            agenda: {
                              event: EventAgenda,
                            },
                          }}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </ClickAwayListener>
                </div>
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
                    Chapel
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
                {!chapelApi && (
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
                              item?.chapelImage.length <= 0
                                ? '/noimg.jpg'
                                : item?.chapelImage[0].secure_url
                            }
                          />
                          <CardContent className={classes.cardContent}>
                            <Typography fontWeight="bold" variant="subtitle1">
                              {item.name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions className={classes.cardAction}>
                          <div style={{ display: 'inline-flex' }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: 'text.disabled' }}
                            >
                              Price per day:&nbsp;&nbsp;
                            </Typography>
                            <Typography
                              align="center"
                              variant="body2"
                              color="secondary"
                            >
                              {pesoFormat(item.price)}
                            </Typography>
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
      <ViewChapel
        id={chapelId}
        open={openChapelDialog}
        eventHandler={handleChapelDialog}
      />
    </>
  )
}

function EventAgenda({ event }: { event: any }) {
  return (
    <span>
      <Typography
        fontWeight={600}
        color="secondary"
        fontStyle="italic"
        variant="subtitle1"
      >
        {event.title}
      </Typography>
      <Typography variant="body2">{event.desc}</Typography>
    </span>
  )
}
export default Chapel
