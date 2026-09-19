import axios from 'axios'
import { handleDemoRequest } from './demoApi'
import { tokenService } from '../services/tokenService'

const useDemo = import.meta.env.VITE_USE_DEMO !== 'false'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

axiosInstance.interceptors.request.use((config) => {
  const token = tokenService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

if (useDemo) {
  axiosInstance.defaults.adapter = async (config) => {
    try {
      const data = await handleDemoRequest({
        method: config.method,
        url: `${config.baseURL || ''}${config.url || ''}`,
        data: config.data,
        headers: config.headers,
      })
      return {
        data: { success: true, data },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      }
    } catch (error) {
      const status = error.status || 500
      return Promise.reject({
        message: error.message,
        response: {
          status,
          data: { success: false, message: error.message, code: error.code },
        },
        config,
        isAxiosError: true,
      })
    }
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenService.clear()
    }
    return Promise.reject(error)
  },
)
