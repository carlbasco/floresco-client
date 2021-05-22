import { useEffect, useState } from 'react'
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

import useStyles from '@styles/components/tableStyles'
import useSWR, { trigger } from 'swr'
import { pesoFormat, SpanBadge } from '@components'
import { LoadingButton } from '@material-ui/lab'
import { axiosInstance, Snackbar } from '@lib'

const ViewPackage = (props: iViewPackage) => {
  const { data: packageApi, isValidating } = useSWR(
    props.open ? '/api/shop/package/' + props.id : null
  )

  const [apiRequest, setApiRequest] = useState(false)
  const handleClickAddToCart = async (id: number) => {
    try {
      setApiRequest(true)
      const req = await axiosInstance.post('/api/cart/package/' + id)
      const res = await req.data
      trigger('/api/cart/count')
      props.eventHandler()
      Snackbar.info(res.msg)
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
      <Dialog
        maxWidth="md"
        open={props.open}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <div className={classes.dialog}>
          <DialogTitle>
            View Package
            <IconButton
              onClick={props.eventHandler}
              className={classes.btnClose}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            <div style={{ width: '500px', padding: '1em 1.5em' }}>
              <Grid container direction="row">
                {isValidating ? (
                  <>
                    <Grid item xs={6}>
                      <Skeleton
                        height={60}
                        width={120}
                        variant="text"
                        animation="wave"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton
                        height={60}
                        width={120}
                        variant="text"
                        animation="wave"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          height={60}
                        />
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={6} display="inline-flex">
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main' }}
                      >
                        Name:&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageApi?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight={400}
                        variant="subtitle2"
                        sx={{ color: 'primary.main', marginTop: '.5em' }}
                      >
                        Description:&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageApi?.description}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              <TableContainer
                sx={{ marginTop: '1em' }}
                className={classes.tableContainer}
              >
                <Typography variant="subtitle2" color="primary">
                  Product List:
                </Typography>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="center" colSpan={2}>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isValidating ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <CircularProgress />
                          <Typography variant="subtitle2">Loading</Typography>
                        </TableCell>
                      </TableRow>
                    ) : packageApi?.Product.length <= 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="subtitle2">
                            No records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {packageApi?.Product.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell colSpan={2}>{item.name}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right">
                            {packageApi?.Product.length <= 0
                              ? 'Not Available'
                              : packageApi?.Product &&
                                pesoFormat(
                                  packageApi?.Product.reduce(
                                    (total: number, val: any) =>
                                      total + val.price,
                                    0
                                  )
                                )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="right">Discount</TableCell>
                          <TableCell align="right">
                            {packageApi?.discount}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="right">Final Price</TableCell>
                          <TableCell align="right">
                            {packageApi?.Product.length > 0 &&
                              pesoFormat(
                                packageApi?.Product.reduce(
                                  (total: number, val: any) =>
                                    total + val.price,
                                  0
                                ) -
                                  (packageApi?.discount / 100) *
                                    packageApi?.Product.reduce(
                                      (total: number, val: any) =>
                                        total + val.price,
                                      0
                                    )
                              )}
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {packageApi?.Product.length > 0 && (
                <div
                  style={{
                    marginTop: '1em',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    pending={apiRequest}
                    onClick={() => handleClickAddToCart(packageApi?.id)}
                  >
                    Add to Cart
                  </LoadingButton>
                </div>
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}

interface iViewPackage {
  id: number
  open: boolean
  eventHandler: () => void
}

export default ViewPackage
