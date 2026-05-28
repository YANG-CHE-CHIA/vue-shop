import { useCookies } from '@vueuse/integrations/useCookies'

const TokenKey = 'token'
const cookies = useCookies()

//獲取token
export function getToken() {
    return cookies.get(TokenKey)
}

//設置token
export function setToken(token) {
    return cookies.set(TokenKey, token)
}

//移除token
export function removeToken() {
    return cookies.remove(TokenKey)
}
    