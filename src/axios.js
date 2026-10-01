import axios from 'axios'
import { ref } from 'vue'
import { toast } from '@/composables/util'
import { getToken } from '@/composables/auth'

const errorMessage = ref('')

const service = axios.create({
    baseURL: '/api'
})

service.interceptors.request.use(config => {
    const token = getToken()
    if (token) {
        config.headers['token'] = token
    }
    return config
}, 
error => {
    return Promise.reject(error)
})

service.interceptors.response.use(response => {
    errorMessage.value = ''
    return response.request.responseType == 'blob' ? response.data : response.data.data
}, 
error => {
    const msg = error?.response?.data?.msg || '請求失敗'
    errorMessage.value = msg

    toast(errorMessage.value, 'error');

    return Promise.reject(error)
})

export default service