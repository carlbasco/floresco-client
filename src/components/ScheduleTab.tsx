import { ChangeEvent, MouseEvent, useState } from 'react'
import useSWR from 'swr'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import {
  CircularProgress,
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
import { Delete, Edit, Search } from '@material-ui/icons'

import { ScheduleDialog, TablePaginationAction } from '@components'
import useStyles from '@styles/pages/schedule'
import { searchFilter } from '@utils'

const Schedules = () => {
  const { data: schedApi } = useSWR('/api/schedules/list')
  const localizer = momentLocalizer(moment)

  const [keyword, setKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const results = !keyword ? schedApi : searchFilter(schedApi, keyword)

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

  const [selectedId, setSelectedId] = useState(0)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }
  const handleDelete = (id: number) => {
    setSelectedId(id)
    handleDeleteDialog()
  }

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const handleUpdateDialog = () => {
    setOpenUpdateDialog(!openUpdateDialog)
  }
  const handleUpdate = (id: number) => {
    setSelectedId(id)
    handleUpdateDialog()
  }

  const classes = useStyles()
  return (
    <>
      <Paper elevation={24} className={classes.root}>
        <Calendar
          endAccessor="end"
          startAccessor="start"
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
      </Paper>
      <Paper elevation={24} className={classes.paper}>
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
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCellMain}>Chapel</TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  Start Date
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  EndDate
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!schedApi ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                    <Typography variant="body1">Loading</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.title} - {item.desc}
                    </TableCell>
                    <TableCell align="center">
                      {moment(item.start).format('LL')}
                    </TableCell>
                    <TableCell align="center">
                      {moment(item.end).format('LL')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Reservation">
                        <IconButton onClick={() => handleUpdate(item.id)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete reservation">
                        <IconButton onClick={() => handleDelete(item.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[
            5,
            10,
            15,
            20,
            { value: !schedApi ? 0 : results.length, label: 'All' },
          ]}
          colSpan={3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          count={!schedApi ? 0 : results.length}
          ActionsComponent={TablePaginationAction}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ScheduleDialog.Update
        id={selectedId}
        open={openUpdateDialog}
        eventHandler={handleUpdateDialog}
      />
      <ScheduleDialog.Delete
        id={selectedId}
        open={openDeleteDialog}
        eventHandler={handleDeleteDialog}
      />
    </>
  )
}

function EventAgenda({ event }: { event: any }) {
  const classes = useStyles()
  return (
    <span>
      <Typography
        color="secondary"
        variant="subtitle1"
        className={classes.eventTitle}
      >
        {event.title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {event.desc}
      </Typography>
    </span>
  )
}

export default Schedules
