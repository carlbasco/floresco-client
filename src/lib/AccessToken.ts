import { axios } from '@lib'

export let accessToken = ''
export const setAccessToken = (token: string) => {
  accessToken = token
}
export const getAccessToken = () => accessToken

export const ssrFetchAccessToken = async (token: string) => {
  try {
    const res = await axios({
      url: '/api/auth/token',
      method: 'GET',
      headers: {
        cookie: 'rtid=' + token,
      },
    })
    const data = res.data
    setAccessToken(data)
  } catch (err) {
    // console.log(err)
  }
}
