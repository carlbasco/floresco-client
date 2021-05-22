import { ChangeEvent, MouseEvent, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import moment from 'moment'
import {
  Breadcrumbs,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core'

import { ClientLayout } from '@layouts'
import useStyles from '@styles/pages/shop/mycontract'
import {
  pesoFormat,
  SpanBadge,
  TablePaginationAction,
  ViewContract,
} from '@components'
import { Payment, Search, Visibility } from '@material-ui/icons'
import { searchFilter } from '@utils'

const mycontracts = () => {
  const { data: contractListApi } = useSWR('/api/user/contract/list')

  const [keyword, setKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const results = !keyword
    ? contractListApi
    : searchFilter(contractListApi, keyword)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const handleChangePage = (
    e: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const [contractDialog, setContractDialog] = useState(false)
  const [id, setId] = useState('')
  const handleDialog = () => {
    setContractDialog(!contractDialog)
  }

  const handleViewDialog = (id: string) => {
    setId(id)
    handleDialog()
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>My Contracts</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ClientLayout>
        <Container maxWidth="lg" className={classes.container}>
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
            <Typography variant="body1" fontWeight={600} color="secondary">
              My Contracts
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" className={classes.pageSubtitle}>
            List of Contracts
          </Typography>
          <Paper elevation={17} className={classes.paper}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TextField
                label="search"
                size="small"
                sx={{ marginBottom: '.5em' }}
                onChange={handleChangeSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <TableContainer>
              <Table stickyHeader>
                {!contractListApi ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        className={classes.noBorderCell}
                      >
                        <CircularProgress />
                        <Typography variant="subtitle2">Loading</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : contractListApi?.length <= 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        className={classes.noBorderCell}
                      >
                        You dont have any Contracts ordered yet
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: '180px' }}>
                          Contract #
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: '120px' }}>
                          Order Date
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: '120px' }}>
                          Amount
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: '80px' }}>
                          Contract Status
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: '80px' }}>
                          Payment Status
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: '150px' }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className={classes.noBorderCell}>
                            {item.id}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.noBorderCell}
                          >
                            {moment(item.orderDate).format('LL')}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ minWidth: '120px' }}
                            className={classes.noBorderCell}
                          >
                            {pesoFormat(item.totalPrice)}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.noBorderCell}
                          >
                            <SpanBadge
                              label={item.status}
                              variant={
                                item.status === 'pending'
                                  ? 'warning'
                                  : item.status === 'completed'
                                  ? 'success'
                                  : item.status === 'ongoing'
                                  ? 'info'
                                  : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.noBorderCell}
                          >
                            <SpanBadge
                              label={item.paymentStatus}
                              variant={
                                item.paymentStatus === 'pending'
                                  ? 'warning'
                                  : item.paymentStatus === 'paid'
                                  ? 'success'
                                  : item.paymentStatus === 'processing'
                                  ? 'info'
                                  : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.noBorderCell}
                          >
                            {item.paymentStatus === 'pending' && (
                              <Tooltip title="Pay now">
                                <>
                                  <IconButton
                                    disabled={
                                      item.paymentStatus === 'paid' ||
                                      item.paymentStatus === 'processing'
                                        ? true
                                        : false
                                    }
                                    onClick={() =>
                                      window.open(
                                        `/shop/cart/checkout/${item.id}`
                                      )
                                    }
                                  >
                                    <Payment className={classes.payment} />
                                  </IconButton>
                                </>
                              </Tooltip>
                            )}

                            <Tooltip title="View">
                              <IconButton
                                onClick={() => handleViewDialog(item.id)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[
                5,
                10,
                15,
                20,
                { value: !contractListApi ? 0 : results.length, label: 'All' },
              ]}
              colSpan={3}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              count={!contractListApi ? 0 : results.length}
              ActionsComponent={TablePaginationAction}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          <ViewContract
            open={contractDialog}
            id={id}
            eventHandler={handleDialog}
          />
        </Container>
      </ClientLayout>
    </>
  )
}

export default mycontracts
