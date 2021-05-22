import Axios from 'axios'
import { store } from '@redux'
import { SWRConfiguration } from 'swr'
import jwtDecode, { JwtPayload } from 'jwt-decode'

import { getAccessToken, setAccessToken } from './AccessToken'
import { AUTH_ERROR } from 'src/redux/types'
import { Snackbar } from '@lib'

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:3001'

Axios.defaults.baseURL = baseURL
Axios.defaults.withCredentials = true
Axios.defaults.headers.post['Content-Type'] = 'application/json'

//request for not authenticated
export const axios = Axios.create()
axios.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    if (err.response.status === 401) {
      if (err.response.data.msg === 'Session Expired') {
        store.dispatch({ type: AUTH_ERROR })
        Snackbar.info(err.response.data.msg)
      } else {
        store.dispatch({ type: AUTH_ERROR })
      }
    }
    return Promise.reject(err)
  }
)

//request for authenticated
export const axiosInstance = Axios.create()
axiosInstance.interceptors.request.use(async (config) => {
  let token = getAccessToken()
  if (token === '' || token === undefined) {
    await axios.get('/api/auth/token').then((res) => setAccessToken(res.data))
  } else {
    const decoded = jwtDecode<JwtPayload>(token)
    if (Date.now() >= decoded.exp! * 1000) {
      await axios.get('/api/auth/token').then((res) => setAccessToken(res.data))
    }
  }
  config.headers['Authorization'] = 'Bearer ' + getAccessToken()
  return config
})

axiosInstance.interceptors.response.use(
  (res) => {
    return res
  },
  async function (err) {
    if (err.response.status === 401) {
      if (err.response.data.msg === 'Session Expired') {
        store.dispatch({ type: AUTH_ERROR })
        Snackbar.info(err.response.data.msg)
      } else {
        store.dispatch({ type: AUTH_ERROR })
      }
    }
    return Promise.reject(err)
  }
)

export const swrConfig: SWRConfiguration = {
  fetcher: (url: string) => axiosInstance.get(url).then((res) => res.data),
  refreshInterval: 1000 * 60,
}

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data)
