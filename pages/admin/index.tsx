import { ChangeEvent, MouseEvent, useState } from 'react'
import Head from 'next/head'
import moment from 'moment'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import {
  Avatar,
  CircularProgress,
  Container,
  Grid,
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
import {
  Cached,
  Cancel,
  CheckCircleOutline,
  Money,
  MoreHoriz,
  NoteAlt,
  Person,
  Search,
  Visibility,
} from '@material-ui/icons'

import { pesoFormat, SpanBadge, TablePaginationAction } from '@components'
import { AdminLayout } from '@layouts'
import { searchFilter } from '@utils'
import useStyles from '@styles/pages/admin'

const Admin = () => {
  const router = useRouter()
  const { data: stats } = useSWR('/api/dashboard/stats')
  const { data: contractListApi } = useSWR('/api/contracts/list')

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

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout index={0}>
        <div>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="600"
            sx={{ marginBottom: '1.5em' }}
          >
            Dashboard
          </Typography>
        </div>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper elevation={17} className={classes.usersCard}>
                <Typography variant="subtitle2">Total Users</Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h4" className={classes.cardText}>
                    {stats?.users ? stats?.users : 0}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <Person className={classes.usersIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={17} className={classes.contractCard}>
                <Typography variant="subtitle2">Total Contracts</Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h4" className={classes.cardText}>
                    {stats?.contracts ? stats?.contracts : 0}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <NoteAlt className={classes.contractIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={17} className={classes.incomeCard}>
                <Typography variant="subtitle2">
                  Monthly Total Income
                </Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h5" className={classes.cardText}>
                    {stats?.income ? pesoFormat(stats?.income) : pesoFormat(0)}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <Money className={classes.incomeIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={17} className={classes.pendingCard}>
                <Typography variant="subtitle2">Pending Contracts</Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h4" className={classes.cardText}>
                    {stats?.pending ? stats?.pending : 0}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <MoreHoriz className={classes.pendingIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={17} className={classes.onGoingCard}>
                <Typography variant="subtitle2">On-going Contracts</Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h4" className={classes.cardText}>
                    {stats?.ongoing ? stats?.ongoing : 0}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <Cached className={classes.onGoingIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={17} className={classes.canceledCard}>
                <Typography variant="subtitle2">Canceled Contracts</Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h4" className={classes.cardText}>
                    {stats?.canceled ? stats?.canceled : 0}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <Cancel className={classes.canceledIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={17} className={classes.completedCard}>
                <Typography variant="subtitle2">Completed Contracts</Typography>
                <div className={classes.cardContent}>
                  <Typography variant="h4" className={classes.cardText}>
                    {stats?.completed ? stats?.completed : 0}
                  </Typography>
                  <Avatar className={classes.cardAvatar}>
                    <CheckCircleOutline className={classes.completedIcon} />
                  </Avatar>
                </div>
              </Paper>
            </Grid>
          </Grid>

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
                        className={classes.noBorderBottom}
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
                        className={classes.noBorderBottom}
                      >
                        No records found
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
                          <TableCell className={classes.noBorderBottom}>
                            {item.id}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.noBorderBottom}
                          >
                            {moment(item.orderDate).format('LL')}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ minWidth: '120px' }}
                            className={classes.noBorderBottom}
                          >
                            {pesoFormat(item.totalPrice)}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.noBorderBottom}
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
                            className={classes.noBorderBottom}
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
                            className={classes.noBorderBottom}
                          >
                            <Tooltip title="View">
                              <IconButton
                                onClick={() =>
                                  router.push('/admin/contract/' + item.id)
                                }
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
        </Container>
      </AdminLayout>
    </>
  )
}

export default Admin
