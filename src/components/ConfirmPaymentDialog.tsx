import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

const ConfirmPaymentDialog = (props: iProps) => {
  const handleSubmit = () => {
    props.actionHandler()
    props.eventHandler()
  }
  return (
    <>
      <Dialog
        maxWidth="sm"
        open={props.open}
        onClose={props.eventHandler}
        PaperProps={{ style: { margin: '1em' } }}
      >
        <DialogTitle>Confirm Payment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to pay {props.price} with your debit/credit
            card?
          </DialogContentText>
          <DialogActions>
            <Button onClick={props.eventHandler} color="inherit">Cancel</Button>
            <Button type="submit" color="primary" onClick={handleSubmit}>
              Confirm Payment
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface iProps {
  open: boolean
  eventHandler: () => void
  actionHandler: () => void
  price?: string
}

export default ConfirmPaymentDialog
