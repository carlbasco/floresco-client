import { ChangeEvent, MouseEvent, SyntheticEvent, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import useSWR from 'swr'
import moment from 'moment'
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
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
  MoreHoriz,
  Search,
  Visibility,
} from '@material-ui/icons'

import { PicLayout } from '@layouts'
import {
  pesoFormat,
  ScheduleTab,
  SpanBadge,
  TablePaginationAction,
} from '@components'
import { searchFilter } from '@utils'
import useStyles from '@styles/pages/pic'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'

const PIC = () => {
  const [selectedTab, setSelectedTab] = useState('1')
  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue)
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Person In-Charge's Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PicLayout>
        <TabContext value={selectedTab}>
          <Container maxWidth="lg" className={classes.container}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '1em' }}
            >
              <TabList onChange={handleChange}>
                <Tab label="Contract" value="1" />
                <Tab label="Schedule" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" className={classes.tabPanel}>
              <ContractList />
            </TabPanel>
            <TabPanel value="2" className={classes.tabPanel}>
              <ScheduleTab />
            </TabPanel>
          </Container>
        </TabContext>
      </PicLayout>
    </>
  )
}

const ContractList = () => {
  const { data: stats } = useSWR('/api/dashboard/stats')
  const { data: contractListApi } = useSWR('/api/contracts/list')

  const router = useRouter()

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
      <Grid container spacing={2}>
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
                    You dont have any Contracts ordered yet
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: '180px' }}>Contract #</TableCell>
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
                              router.push('/pic/contract/' + item.id)
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
    </>
  )
}

export default PIC
