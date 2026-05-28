import axios from '@/axios'

//登入
export const login = async (username, password) => {
  try {
    const res = await axios.post('/admin/login', { username, password })
    return res 
  } 
  catch (error) {
    // 💡 使用 ?. 防止後端沒回傳東西時崩潰，並提供預設錯誤訊息
    const errorMsg = error?.res?.data?.msg || '請求失敗'
    throw error 
  }
}

//獲取用戶信息
export const getUserInfo = async () => {
  try {
    const res = await axios.post('/admin/getinfo')
    return res 
  } 
  catch (error) {

    throw error 
  } 
}