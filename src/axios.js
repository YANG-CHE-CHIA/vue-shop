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
    return response.data.data
}, 
error => {
    errorMessage.value = error?.response?.data?.msg || '請求失敗'

    toast(errorMessage.value, 'error');

    return Promise.reject(error)
})

export default service