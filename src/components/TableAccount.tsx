import { ChangeEvent, MouseEvent, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR, { trigger } from 'swr'

import { axiosInstance, Snackbar } from '@lib'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Hidden,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { Delete, Edit, PersonAdd, Search } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'

import { SpanBadge, TablePaginationAction } from '@components'
import { searchFilter } from '@utils'
import useStyles from '@styles/components/tableStyles'

const TableAccount = () => {
  const { data: userApi } = useSWR('/api/account')

  const [keyword, setKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const results = !keyword ? userApi : searchFilter(userApi, keyword)

  const [apiRequest, setApiRequest] = useState(false)
  const [user, setUser] = useState({
    id: '',
    email: '',
  })
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleOpenDeleteDialog = (id: string, email: string) => {
    setUser({ id, email })
    setOpenDeleteDialog(true)
  }
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

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

  const router = useRouter()
  const handleClickEditUser = (id: string) => {
    const selectUser = userApi.filter((user: any) => user.id === id)
    if (selectUser[0].role === 'admin') {
      Snackbar.warning(" You cannot modify admin's account")
    } else {
      router.push('/admin/accounts/edit/' + id)
    }
  }
  const handleClickDeleteUser = async () => {
    const selectUser = userApi.filter((item: any) => item.id === user.id)
    if (selectUser[0].role === 'admin') {
      Snackbar.error(" You cannot delete admin's account")
      setOpenDeleteDialog(false)
    } else {
      try {
        setApiRequest(true)
        const req = await axiosInstance({
          url: '/api/account/' + user.id,
          method: 'DELETE',
        })
        const res = await req.data
        Snackbar.success(res.msg)
      } catch (err) {
        if (err.response.data.msg) {
          Snackbar.error(err.response.data.msg)
        }
      } finally {
        setOpenDeleteDialog(false)
        setApiRequest(false)
        trigger('/api/accounts/list')
      }
    }
  }

  const classes = useStyles()
  return (
    <>
      <Paper className={classes.paper} elevation={24}>
        <div className={classes.paperHeader}>
          <FormControl size="small" margin="dense" variant="outlined">
            <InputLabel>Search</InputLabel>
            <OutlinedInput
              margin="dense"
              labelWidth={55}
              value={keyword}
              className={classes.input}
              onChange={handleChangeSearch}
              endAdornment={
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              }
            />
          </FormControl>
          <div className={classes.btnNew}>
            <Hidden smDown>
              <Button
                color="primary"
                onClick={() => router.push('/admin/accounts/new')}
                startIcon={<PersonAdd />}
              >
                New Account
              </Button>
            </Hidden>
            <Hidden smUp>
              <Tooltip title="New Account">
                <IconButton onClick={() => router.push('/admin/accounts/new')}>
                  <PersonAdd color="primary" />
                </IconButton>
              </Tooltip>
            </Hidden>
          </div>
        </div>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {header.map((column) => (
                  <TableCell
                    key={column.label}
                    align={column.align}
                    className={classes.tableHeadCell}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!userApi ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                    <Typography variant="subtitle2">Loading</Typography>
                  </TableCell>
                </TableRow>
              ) : userApi.length <= 0 || userApi.length === undefined ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                    <Typography variant="subtitle2">Loading</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: iTableRowCell) => {
                    const { firstName, lastName, middleName } = item
                    let fullName
                    middleName === null || undefined
                      ? (fullName = lastName + ', ' + firstName)
                      : (fullName =
                          lastName + ', ' + firstName + ' ' + middleName)
                    return (
                      <TableRow hover key={item.id}>
                        <TableCell sx={{ minWidth: '200px' }}>
                          {fullName}
                        </TableCell>
                        <TableCell sx={{ minWidth: '250px' }}>
                          {item.email}
                        </TableCell>
                        <TableCell align="center">
                          {item.role === 'admin'
                            ? 'Admin'
                            : item.role === 'pic'
                            ? 'Person In-Charge'
                            : 'Client'}
                        </TableCell>
                        <TableCell align="center">
                          {item.emailVerified === true ? (
                            <SpanBadge variant="success" label="Yes" />
                          ) : (
                            <SpanBadge variant="error" label="No" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {item.isActive === true ? (
                            <SpanBadge variant="success" label="Active" />
                          ) : (
                            <SpanBadge variant="error" label="Not Active" />
                          )}
                        </TableCell>
                        <TableCell align="center" style={{ minWidth: '130px' }}>
                          <Tooltip title="Edit Account" arrow>
                            <IconButton
                              onClick={() => handleClickEditUser(item.id)}
                            >
                              <Edit color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Account" arrow>
                            <IconButton
                              onClick={() =>
                                handleOpenDeleteDialog(item.id, item.email)
                              }
                            >
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[
            5,
            15,
            20,
            { value: !userApi ? 0 : results.length, label: 'All' },
          ]}
          colSpan={3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          count={!userApi ? 0 : results.length}
          ActionsComponent={TablePaginationAction}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete
            <span className={classes.span}>&nbsp; {user.email} 's &nbsp;</span>
            account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={apiRequest}
            className={classes.btnCancel}
            onClick={handleCloseDeleteDialog}
          >
            Cancel
          </Button>
          <LoadingButton
            className={classes.btnDelete}
            onClick={handleClickDeleteUser}
            autoFocus
            pending={apiRequest}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface iTableHead {
  label: string
  align?: 'right' | 'left' | 'center'
}
const header: iTableHead[] = [
  { label: 'Full Name', align: 'left' },
  { label: 'Email', align: 'left' },
  { label: 'Role', align: 'center' },
  { label: 'Verified', align: 'center' },
  { label: 'Status', align: 'center' },
  { label: 'Action', align: 'center' },
]
interface iTableRowCell {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  role: string
  emailVerified: boolean
  isActive: boolean
}

export default TableAccount
