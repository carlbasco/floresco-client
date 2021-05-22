import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import { DateRange } from '@material-ui/lab/DateRangePicker/RangeTypes'
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'

import {
  Page,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Text,
  View,
} from '@react-pdf/renderer'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kucsai/react-pdf-table'

import { AdminLayout } from '@layouts'
import useStyles from '@styles/pages/report'
import { LoadingButton, MobileDateRangePicker } from '@material-ui/lab'
import { axiosInstance, Snackbar } from '@lib'
import { pesoFormat } from '@components'

const Reports = () => {
  const [contract, setContract] = useState([])
  const [date, setDate] = useState<DateRange<Date>>([null, null])
  const [status, setStatus] = useState('')
  const handleChangeStatus = (
    e: ChangeEvent<{
      name?: string | undefined
      value: string
      event: Event | SyntheticEvent<Element, Event>
    }>
  ) => {
    setContract([])
    setStatus(e.target.value)
  }

  const [apiRequest, setApiRequest] = useState(false)
  const generateReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContract([])
    try {
      setApiRequest(true)
      const req = await axiosInstance({
        url: '/api/report',
        method: 'POST',
        data: {
          date,
          status,
        },
      })
      const res = await req.data
      if (res.length > 0) {
        setContract(res)
      } else {
        Snackbar.info('No exisiting data found')
      }
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      setApiRequest(false)
    }
  }

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      paddingTop: 50,
      paddingBottom: 65,
      paddingHorizontal: 50,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      padding: 10,
    },
    tableData: {
      textAlign: 'center',
    },
    td: {
      padding: '0 5px 0 5px',
    },
    tdCenter: {
      padding: '0 5px 0 5px',
      textAlign: 'center',
    },
    tdRight: {
      padding: '0 5px 0 5px',
      textAlign: 'right',
    },
    pdfButton: {
      textDecoration: 'none',
      color: 'white',
    },
    textHeader: {
      textAlign: 'center',
      fontSize: 12,
    },
    textHeaderLast: {
      textAlign: 'center',
      fontSize: 12,
      marginBottom: 30,
    },
    viewMain: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  })

  const Doc = () => {
    if (contract.length > 0 && status === 'all') {
      return (
        <Document>
          <Page size="LETTER" style={styles.page}>
            <View style={styles.viewMain}>
              <Text style={styles.textHeader}>Floresco Funeral</Text>
              <Text style={styles.textHeader}>
                127 Floresco Street Barangay Baesa
              </Text>
              <Text style={styles.textHeaderLast}>
                Quezon CIty, Metro Manila 1107
              </Text>
              <Table data={contract}>
                <TableHeader>
                  <TableCell style={styles.tdCenter} weighting={0.35}>
                    Contract #
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.18}>
                    Order Date
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.18}>
                    Status
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.16}>
                    Payment Status
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.2}>
                    Price
                  </TableCell>
                </TableHeader>
                <TableBody>
                  <DataTableCell
                    style={styles.td}
                    getContent={(r) => r.id}
                    weighting={0.35}
                  />
                  <DataTableCell
                    style={styles.tdCenter}
                    weighting={0.18}
                    getContent={(r) =>
                      new Date(r.orderDate).toISOString().slice(0, 10)
                    }
                  />
                  <DataTableCell
                    style={styles.tdCenter}
                    weighting={0.18}
                    getContent={(r) =>
                      r.status === 'pending'
                        ? 'Pending'
                        : r.status === 'ongoing'
                        ? 'On going'
                        : r.status === 'canceled'
                        ? 'Canceled'
                        : 'Completed'
                    }
                  />
                  <DataTableCell
                    style={styles.tdCenter}
                    weighting={0.16}
                    getContent={(r) => r.paymentStatus}
                  />
                  <DataTableCell
                    style={styles.tdRight}
                    weighting={0.2}
                    getContent={(r) => r.totalPrice}
                  />
                </TableBody>
              </Table>
            </View>
          </Page>
        </Document>
      )
    } else {
      return (
        <Document>
          <Page size="LETTER" style={styles.page}>
            <View style={styles.viewMain}>
              <Text style={styles.textHeader}>Floresco Funeral</Text>
              <Text style={styles.textHeader}>
                127 Floresco Street Barangay Baesa
              </Text>
              <Text style={styles.textHeaderLast}>
                Quezon CIty, Metro Manila 1107
              </Text>
              <Table data={contract}>
                <TableHeader>
                  <TableCell style={styles.tdCenter} weighting={0.35}>
                    Contract #
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.2}>
                    Order Date
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.22}>
                    Payment Status
                  </TableCell>
                  <TableCell style={styles.tdCenter} weighting={0.23}>
                    Price
                  </TableCell>
                </TableHeader>
                <TableBody>
                  <DataTableCell
                    style={styles.td}
                    weighting={0.35}
                    getContent={(r) => r.id}
                  />
                  <DataTableCell
                    style={styles.tdCenter}
                    weighting={0.2}
                    getContent={(r) =>
                      new Date(r.orderDate).toISOString().slice(0, 10)
                    }
                  />
                  <DataTableCell
                    style={styles.tdCenter}
                    weighting={0.22}
                    getContent={(r) => r.paymentStatus}
                  />
                  <DataTableCell
                    style={styles.tdRight}
                    weighting={0.23}
                    getContent={(r) => r.totalPrice}
                  />
                </TableBody>
              </Table>
            </View>
          </Page>
        </Document>
      )
    }
  }

  const classes = useStyles()
  return (
    <>
      <Head>
        <title>Reports</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminLayout index={5}>
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
            <Typography color="textSecondary" variant="body1">
              Report
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="primary" fontWeight="600">
            Contract Report
          </Typography>
        </div>
        <Container maxWidth="lg">
          <Grid
            container
            sx={{ marginTop: '1.5em' }}
            spacing={2}
            direction="column"
          >
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={17}
                    sx={{
                      padding: '1em',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <form onSubmit={(e) => generateReport(e)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDateRangePicker
                          value={date}
                          onChange={(date) => {
                            setDate(date)
                          }}
                          renderInput={(startProps, endProps) => (
                            <>
                              <TextField
                                required
                                size="small"
                                label="From"
                                {...startProps}
                                variant="outlined"
                              />
                              <Box sx={{ mx: 2 }}></Box>
                              <TextField
                                required
                                label="To"
                                size="small"
                                {...endProps}
                                variant="outlined"
                              />
                            </>
                          )}
                        />
                      </LocalizationProvider>
                      <FormControl
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ marginTop: '1em' }}
                      >
                        <InputLabel required>Contract Status</InputLabel>
                        <Select
                          required
                          size="small"
                          value={status}
                          labelWidth={125}
                          onChange={(e) => handleChangeStatus(e)}
                        >
                          <MenuItem value="">
                            <em>-----------</em>
                          </MenuItem>
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="ongoing">On going</MenuItem>
                          <MenuItem value="completed">Completed </MenuItem>
                          <MenuItem value="canceled">Canceled</MenuItem>
                        </Select>
                      </FormControl>
                      <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        pending={apiRequest}
                        sx={{ margin: '1em 0' }}
                      >
                        Generate Report
                      </LoadingButton>
                    </form>
                    {contract.length > 0 && (
                      <Button variant="contained" color="secondary">
                        <PDFDownloadLink
                          style={styles.pdfButton}
                          document={<Doc />}
                          fileName={'Contract Report'}
                        >
                          Download
                        </PDFDownloadLink>
                      </Button>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8}>
              {contract.length > 0 && (
                <Paper elevation={17} sx={{ padding: '1em' }}>
                  <PDFViewer width="100%" height="1200px">
                    <Doc />
                  </PDFViewer>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </AdminLayout>
    </>
  )
}

export default Reports
