import { ChangeEvent, MouseEvent, useState } from 'react'
import useSWR from 'swr'
import {
  Button,
  CircularProgress,
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
import { Delete, Edit, AddCircle, Search, Visibility } from '@material-ui/icons'

import {
  pesoFormat,
  SpanBadge,
  TablePaginationAction,
  TableChapelDialog,
} from '@components'
import useStyles from '@styles/components/tableStyles'
import { searchFilter } from '@utils'
import { useRouter } from 'next/router'

const TableChapel = () => {
  const { data: chapelApi } = useSWR('/api/chapel')

  const [searchKeyword, setFilterSearch] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterSearch(e.target.value)
  }
  const results = !searchKeyword
    ? chapelApi
    : searchFilter(chapelApi, searchKeyword)

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

  const [selectedChapel, setSelectedChapel] = useState<iSelectedChapel>({
    id: 0,
    name: '',
  })
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }
  const handleClickDeleteDialog = ({ id, name }: iSelectedChapel) => {
    setSelectedChapel({ id, name })
    handleDeleteDialog()
  }

  const [openNewDialog, setOpenNewDialog] = useState(false)
  const handleNewDialog = () => {
    setOpenNewDialog(!openNewDialog)
  }

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const handleEditDialog = () => {
    setOpenEditDialog(!openEditDialog)
  }
  const handleClickEdit = ({ id, name }: iSelectedChapel) => {
    setSelectedChapel({ id, name })
    handleEditDialog()
  }

  // const [openViewFormDialog, setOpenViewFormDialog] = useState(false)
  // const handleViewFormDialog = () => {
  //   setOpenViewFormDialog(!openViewFormDialog)
  // }
  // const handleClickView = ({ id, name }: iSelectedChapel) => {
  //   setSelectedChapel({ id, name })
  //   handleViewFormDialog()
  // }

  const router = useRouter()
  const classes = useStyles()
  return (
    <>
      <Paper className={classes.paper} elevation={24}>
        <Typography variant="subtitle1" align="center">
          List of Chapel
        </Typography>
        <div className={classes.paperHeader}>
          <FormControl size="small" margin="dense" variant="outlined">
            <InputLabel>Search</InputLabel>
            <OutlinedInput
              margin="dense"
              labelWidth={55}
              value={searchKeyword}
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
                onClick={handleNewDialog}
                startIcon={<AddCircle />}
              >
                New Chapel
              </Button>
            </Hidden>
            <Hidden smUp>
              <Tooltip title="New Chapel">
                <IconButton onClick={handleNewDialog}>
                  <AddCircle color="primary" />
                </IconButton>
              </Tooltip>
            </Hidden>
          </div>
        </div>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {header.map((item) => (
                  <TableCell
                    key={item.label}
                    align={item.align}
                    className={classes.tableHeadCell}
                  >
                    {item.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!chapelApi ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                    <Typography variant="subtitle2">Loading</Typography>
                  </TableCell>
                </TableRow>
              ) : chapelApi.length === undefined || chapelApi.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="subtitle2">No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: iTableRowCell) => {
                    const { id, name, price, isHidden } = row
                    return (
                      <TableRow hover key={id}>
                        <TableCell sx={{ minWidth: '150px' }}>{name}</TableCell>
                        <TableCell align="center">
                          {isHidden ? (
                            <SpanBadge label="Hidden" variant="error" />
                          ) : (
                            <SpanBadge label="Visible" variant="success" />
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: '120px' }}>
                          {pesoFormat(price)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ width: '180px', minWidth: '180px' }}
                        >
                          <Tooltip title="View Chapel" arrow>
                            <IconButton
                              onClick={() =>
                                router.push(
                                  '/admin/filemaintenance/chapel/' + id
                                )
                              }
                            >
                              <Visibility color="secondary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Chapel" arrow>
                            <IconButton
                              onClick={() => handleClickEdit({ id, name })}
                            >
                              <Edit color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Chapel" arrow>
                            <IconButton
                              onClick={() =>
                                handleClickDeleteDialog({ id, name })
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
            { value: !chapelApi ? 0 : results.length, label: 'All' },
          ]}
          colSpan={3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          count={!chapelApi ? 0 : results.length}
          ActionsComponent={TablePaginationAction}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <TableChapelDialog.NewForm
        open={openNewDialog}
        eventHandler={handleNewDialog}
      />
      <TableChapelDialog.EditForm
        id={selectedChapel.id}
        open={openEditDialog}
        eventHandler={handleEditDialog}
      />
      <TableChapelDialog.DeleteDialog
        id={selectedChapel.id}
        open={openDeleteDialog}
        name={selectedChapel.name}
        eventHandler={handleDeleteDialog}
      />
    </>
  )
}

interface iTableHead {
  label: string
  align?: 'right' | 'left' | 'center'
}
const header: iTableHead[] = [
  { label: 'Name', align: 'left' },
  { label: 'Status', align: 'center' },
  { label: 'Price', align: 'center' },
  { label: 'Action', align: 'center' },
]

interface iTableRowCell {
  id: number
  name: string
  price: number
  isHidden: boolean
}
interface iSelectedChapel {
  id: number
  name: string
}
export default TableChapel
