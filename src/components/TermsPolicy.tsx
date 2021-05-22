import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

const Terms = ({ open, eventHandler }: iProps) => {
  return (
    <>
      <Dialog scroll="paper" maxWidth="sm" open={open} onClose={eventHandler}>
        <DialogTitle>
          Terms and Condition
          <IconButton
            onClick={eventHandler}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" align="center">
            AGREEMENT TO TERMS
          </Typography>
          <DialogContentText>
            These Terms of Use constitute a legally binding agreement made
            between you, whether personally or on behalf of an entity (“you”)
            and FloresCo Company ("Company", “we”, “us”, or “our”), concerning
            your access to and use of the http://www.florescofuneral.com website
            as well as any other media form, media channel, mobile website or
            mobile application related, linked, or otherwise connected thereto
            (collectively, the “Site”). You agree that by accessing the Site,
            you have read, understood, and agreed to be bound by all of these
            Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE,
            THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST
            DISCONTINUE USE IMMEDIATELY.
          </DialogContentText>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ marginTop: '1em' }}
          >
            USER AGREEMENT TO TERMS
          </Typography>
          <DialogContentText>
            You may be required to register with the Site. You agree to keep
            your password confidential and will be responsible for all use of
            your account and password. We reserve the right to remove, reclaim,
            or change a username you select if we determine, in our sole
            discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}
const Policy = ({ open, eventHandler }: iProps) => {
  return (
    <>
      <Dialog scroll="paper" maxWidth="sm" open={open} onClose={eventHandler}>
        <DialogTitle>
          Privacy Policy
          <IconButton
            onClick={eventHandler}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            We care about data privacy and security. By using the Site, you
            agree to be bound by our Privacy Policy posted on the Site, which is
            incorporated into these Terms of Use. Please be advised the Site is
            hosted in the Philippines. If you access the Site from any other
            region of the world with laws or other requirements governing
            personal data collection, use, or disclosure that differ from
            applicable laws in the Philippines, then through your continued use
            of the Site, you are transferring your data to the Philippines, and
            you agree to have your data transferred to and processed in the
            Philippines.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

const Contract = ({ open, eventHandler }: iProps) => {
  return (
    <>
      <Dialog scroll="paper" maxWidth="sm" open={open} onClose={eventHandler}>
        <DialogTitle>
          Contract Terms and Condition
          <IconButton
            onClick={eventHandler}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '1.5em' }}>
          <Typography variant="body1" align="justify" gutterBottom>
            1. Once the system recieves the payment, we will start to perform
            the services indicated on the contract
          </Typography>
          <Typography variant="body1" align="justify" gutterBottom>
            2. The client may cancel the service depending on situation. If the
            client already made a payment but the company did not yet perform
            any services, the client can refund their payment.
          </Typography>
          <Typography variant="body1" align="justify" gutterBottom>
            3. If the company already performed some services and the client
            decided to cancel the service, the client is still entitled to pay
            those services that already performed by the company
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface iProps {
  open: boolean
  eventHandler: () => void
}

export default { Terms, Policy, Contract }
