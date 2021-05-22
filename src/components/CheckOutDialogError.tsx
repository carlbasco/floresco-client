import { useRouter } from 'next/router'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import { Error } from '@material-ui/icons'

const CheckOutDialogError = (props: iProps) => {
  const router = useRouter()
  return (
    <>
      <Dialog
        maxWidth="sm"
        open={props.open}
        PaperProps={{ style: { margin: '.5em' } }}
      >
        <DialogTitle disableTypography>
          <Typography
            variant="h6"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Check Out Error&nbsp;&nbsp; <Error color="error" />
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{props.msg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.replace('/shop/mycontracts')}>Go back</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface iProps {
  open: boolean
  msg: string
}

export default CheckOutDialogError
