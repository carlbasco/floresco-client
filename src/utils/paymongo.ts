import { Dispatch, SetStateAction } from 'react'
import Axios from 'axios'
import moment from 'moment'

import { axiosInstance, Snackbar } from '@lib'
import axios from 'axios'
const username = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY!
const password = ''
const token = Buffer.from(`${username}:${password}`).toString('base64')

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_PAYMONGO_URL!
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Axios.defaults.withCredentials = false

export const paymongoCard = async (
  data: iPaymongoCard,
  setApiRequest: Dispatch<SetStateAction<boolean>>,
  contractId: string
) => {
  const { card_number, cvc, line1, city, country, name, email, phone } = data
  const exp_month = parseFloat(moment(new Date(data.exp)).format('MM'))
  const exp_year = parseFloat(moment(new Date(data.exp)).format('YY'))
  try {
    setApiRequest(true)
    //Payment Intent
    const res = await axiosInstance.post('/api/payment_intent/' + contractId)
    const client_key = await res.data
    const id = client_key.split('_client')[0]

    //Payment Method
    const res2 = await Axios({
      url: '/payment_methods',
      method: 'POST',
      headers: { Authorization: `Basic ${token}` },
      data: {
        data: {
          attributes: {
            type: 'card',
            details: { card_number, exp_month, exp_year, cvc },
            billing: { name, email, phone, address: { line1, city, country } },
          },
        },
      },
    })
    const payment_method = await res2.data.data.id

    const requeryPaymentIntent = async () => {
      const res4 = await axios({
        url: `/payment_intents/${id}`,
        method: 'GET',
        headers: { Authorization: `Basic ${token}` },
      })
      const paymentIntent = await res4.data.data
      const paymentStatus = await res4.data.data.attributes.status
      paymentAction(paymentStatus, paymentIntent)
    }

    const paymentAction = async (paymentStatus: string, paymentIntent: any) => {
      if (paymentStatus === 'awaiting_next_action') {
        // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        window.open(paymentIntent.attributes.next_action.redirect.url)
        setApiRequest(false)
        Snackbar.info(
          'This page will be redirect to your contract list after 10 seconds'
        )
        setTimeout(() => {
          location.replace('/shop/mycontracts')
        }, 10000)
      } else if (paymentStatus === 'succeeded') {
        // You already received your customer's payment. You can show a success message from this condition.
        setApiRequest(false)
        Snackbar.success(
          `Payment for Contract # ${contractId} has been made. Please wait for payment server to reflect it on our system`
        )
        Snackbar.info(
          'This page will be redirect to your contract list after 10 seconds'
        )
        setTimeout(() => {
          location.replace('/shop/mycontracts')
        }, 10000)
      } else if (paymentStatus === 'awaiting_payment_method') {
        // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
        setApiRequest(false)
        Snackbar.error(paymentIntent.attributes.last_payment_error)
        Snackbar.info('This page will reload after 10 seconds')
        setTimeout(() => {
          location.reload()
        }, 10000)
      } else if (paymentStatus === 'processing') {
        setTimeout(() => {
          requeryPaymentIntent()
        }, 3000)
        // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
      }
    }

    //Payment Intent Attatch
    try {
      const res5 = await axios({
        url: `/payment_intents/${id}/attach`,
        method: 'POST',
        headers: { Authorization: `Basic ${token}` },
        data: {
          data: { attributes: { client_key, payment_method } },
        },
      })
      const paymentIntent = await res5.data.data
      const paymentStatus = await res5.data.data.attributes.status
      paymentAction(paymentStatus, paymentIntent)
    } catch (err) {
      setApiRequest(false)
      if (err.response.data.errors.length > 0) {
        err.response.data.errors.map((item: any) => Snackbar.error(item.detail))
      }
    }
  } catch (err) {
    if (err.response.data.errors.length > 0) {
      err.response.data.errors.map((item: any) => Snackbar.error(item.detail))
    }
  }
}

interface iPaymongoCard {
  name: string
  email: string
  phone: string
  line1: string
  city: string
  postal_code: string
  country: string
  card_number: string
  exp: Date
  cvc: string
}
