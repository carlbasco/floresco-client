import { ChangeEvent, MouseEvent, useState } from 'react'
import useSWR, { trigger } from 'swr'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Delete, AddCircle, Search, Close } from '@material-ui/icons'
import { LoadingButton } from '@material-ui/lab'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
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

import { CloudLoading, TablePaginationAction } from '@components'
import { axiosInstance, Snackbar } from '@lib'
import { searchFilter } from '@utils'
import useStyles from '@styles/components/tableStyles'

const TableCategory = () => {
  const { data: categoryApi } = useSWR('/api/category')

  const [keyword, setKeyword] = useState('')
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const results = !keyword ? categoryApi : searchFilter(categoryApi, keyword)

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

  const [selectedCategory, setSelectedCategory] = useState<iSelectedPackage>({
    id: 0,
    name: '',
  })
  const [apiDeleteRequest, setApiDeleteRequest] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog)
  }
  const handleOpenDeleteDialog = ({ id, name }: iSelectedPackage) => {
    setSelectedCategory({ id, name })
    handleDeleteDialog()
  }
  const handleClickDelete = async () => {
    setApiDeleteRequest(true)
    if (selectedCategory?.id) {
      try {
        const req = await axiosInstance.delete(
          '/api/category/' + selectedCategory.id
        )
        const res = await req.data
        Snackbar.success(res.msg)
      } catch (err) {
        if (err.response.data.msg) {
          Snackbar.error(err.response.data.msg)
        }
      } finally {
        trigger('/api/category')
        setApiDeleteRequest(false)
        handleDeleteDialog()
      }
    }
  }

  const [openNewFormDialog, setOpenNewFormDialog] = useState(false)
  const [apiNewRequest, setApiNewRequest] = useState(false)
  const handleNewFormDialog = () => {
    setOpenNewFormDialog(!openNewFormDialog)
  }
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })
  const onSubmit = async (data: iForm) => {
    try {
      setApiNewRequest(true)
      const req = await axiosInstance.post('/api/category', data)
      const res = await req.data
      Snackbar.success(res.msg)
    } catch (err) {
      if (err.response.data.msg) {
        Snackbar.error(err.response.data.msg)
      }
    } finally {
      trigger('/api/category')
      reset({ name: '' })
      setApiNewRequest(false)
      handleNewFormDialog()
    }
  }

  const classes = useStyles()
  return (
    <>
      <Paper className={classes.paper} elevation={24}>
        <Typography variant="subtitle1" align="center">
          List of Category
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
                onClick={handleNewFormDialog}
                startIcon={<AddCircle />}
              >
                New Category
              </Button>
            </Hidden>
            <Hidden smUp>
              <Tooltip title="New Category">
                <IconButton onClick={handleNewFormDialog}>
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
                <TableCell className={classes.tableHeadCell}>Name</TableCell>
                <TableCell className={classes.tableHeadCell} align="center">
                  Total Product Count
                </TableCell>
                <TableCell className={classes.tableHeadCell} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!categoryApi ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                    <Typography variant="subtitle2">Loading</Typography>
                  </TableCell>
                </TableRow>
              ) : categoryApi.length === undefined ||
                categoryApi.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="subtitle2">No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: iTableRowCell) => {
                    const { id, name, productCount } = row
                    return (
                      <TableRow key={id}>
                        <TableCell sx={{minWidth:'150px'}}>{name}</TableCell>
                        <TableCell align="center">{productCount}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete Category" arrow>
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
            { value: !categoryApi ? 0 : results.length, label: 'All' },
          ]}
          colSpan={3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          count={!categoryApi ? 0 : results.length}
          ActionsComponent={TablePaginationAction}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialog}>
        <DialogTitle>Delete Package?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            <span className={classes.span}>
              &nbsp; {selectedCategory?.name}&nbsp;
            </span>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={apiDeleteRequest}
            onClick={handleDeleteDialog}
            className={classes.btnCancel}
          >
            Cancel
          </Button>
          <LoadingButton
            className={classes.btnDelete}
            onClick={handleClickDelete}
            autoFocus
            pending={apiDeleteRequest}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openNewFormDialog}>
        <div className={classes.dialog}>
          <DialogTitle>
            New Category
            <IconButton
              className={classes.btnClose}
              onClick={handleNewFormDialog}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth variant="outlined">
                <InputLabel required>Name</InputLabel>
                <Controller
                  name="name"
                  defaultValue=""
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <OutlinedInput
                        value={value}
                        labelWidth={60}
                        onChange={(e) => onChange(e.target.value)}
                      />
                      <FormHelperText error={Boolean(errors.name)}>
                        {errors.name?.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </FormControl>
              <LoadingButton
                fullWidth
                type="submit"
                size="large"
                variant="contained"
                pending={apiNewRequest}
                className={classes.btnSubmit}
              >
                Create Category
              </LoadingButton>
              <CloudLoading open={apiNewRequest} animation="upload" />
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}

interface iTableRowCell {
  id: number
  name: string
  productCount: number
}
interface iSelectedPackage {
  id: number
  name: string
}
interface iForm {
  name: string
}
const schema = yup.object().shape({
  name: yup.string().trim().required('Name of package is required'),
})

export default TableCategory
