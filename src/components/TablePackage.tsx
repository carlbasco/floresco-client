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
  SpanBadge,
  TablePackageDialog,
  TablePaginationAction,
} from '@components'
import { searchFilter } from '@utils'
import useStyles from '@styles/components/tableStyles'

const TablePackage = () => {
  const { data: packageApi } = useSWR('/api/package')

  const [keyword, setKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const results = !keyword ? packageApi : searchFilter(packageApi, keyword)

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

  const [selectedPackage, setSelectedPackage] = useState<iSelectedPackage>({
    id: 0,
    name: '',
  })
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleOpenDeleteDialog = ({ id, name }: iSelectedPackage) => {
    setSelectedPackage({ id, name })
    setOpenDeleteDialog(true)
  }
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const [openNewDialog, setOpenNewDialog] = useState(false)
  const handleNewDialog = () => {
    setOpenNewDialog(!openNewDialog)
  }

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const handleEditDialog = () => {
    setOpenEditDialog(!openEditDialog)
  }
  const handleClickEdit = ({ id, name }: iSelectedPackage) => {
    setSelectedPackage({ id, name })
    handleEditDialog()
  }

  const [openViewDialog, setOpenViewDialog] = useState(false)
  const handleViewDialog = () => {
    setOpenViewDialog(!openViewDialog)
  }
  const handleClickView = ({ id, name }: iSelectedPackage) => {
    setSelectedPackage({ id, name })
    handleViewDialog()
  }

  const classes = useStyles()
  return (
    <>
      <Paper className={classes.paper} elevation={24}>
        <Typography variant="subtitle1" align="center">
          List of Packages
        </Typography>
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
                onClick={handleNewDialog}
                startIcon={<AddCircle />}
              >
                New Package
              </Button>
            </Hidden>
            <Hidden smUp>
              <Tooltip title="New Package">
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
              {!packageApi ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                    <Typography variant="subtitle2">Loading</Typography>
                  </TableCell>
                </TableRow>
              ) : packageApi.length === undefined || packageApi.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="subtitle2">No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: iTableRowCell) => {
                    const { id, name, productCount, isHidden } = row
                    return (
                      <TableRow hover key={id}>
                        <TableCell style={{ minWidth: '150px' }}>
                          {name}
                        </TableCell>
                        <TableCell align="center">{productCount}</TableCell>
                        <TableCell align="center">
                          {isHidden ? (
                            <SpanBadge label="Hidden" variant="error" />
                          ) : (
                            <SpanBadge label="Visible" variant="success" />
                          )}
                        </TableCell>
                        <TableCell align="center" style={{ minWidth: '180px' }}>
                          <Tooltip title="View Product" arrow>
                            <IconButton
                              onClick={() => handleClickView({ id, name })}
                            >
                              <Visibility color="secondary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Package" arrow>
                            <IconButton
                              onClick={() => handleClickEdit({ id, name })}
                            >
                              <Edit color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Package" arrow>
                            <IconButton
                              onClick={() =>
                                handleOpenDeleteDialog({ id, name })
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
            { value: !packageApi ? 0 : results.length, label: 'All' },
          ]}
          colSpan={3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          count={!packageApi ? 0 : results.length}
          ActionsComponent={TablePaginationAction}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <TablePackageDialog.NewDialog
        open={openNewDialog}
        eventHandler={handleNewDialog}
      />
      <TablePackageDialog.EditDialog
        open={openEditDialog}
        id={selectedPackage.id}
        eventHandler={handleEditDialog}
      />
      <TablePackageDialog.DeleteDialog
        open={openDeleteDialog}
        selectedPackage={selectedPackage}
        eventHandler={handleCloseDeleteDialog}
      />
      <TablePackageDialog.ViewDialog
        open={openViewDialog}
        id={selectedPackage.id}
        eventHandler={handleViewDialog}
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
  { label: 'Total product count', align: 'center' },
  { label: 'Status', align: 'center' },
  { label: 'Action', align: 'center' },
]
interface iTableRowCell {
  id: number
  name: string
  productCount: number
  isHidden: boolean
}
interface iSelectedPackage {
  id: number
  name: string
}
export default TablePackage
