import axios from '@/axios'

export const login = async (username, password) => {
  try {
    const response = await axios.post('/admin/login', { username, password })
    return response 
  } 
  catch (error) {
    // 💡 使用 ?. 防止後端沒回傳東西時崩潰，並提供預設錯誤訊息
    const errorMsg = error?.response?.data?.msg || '請求失敗'
    throw error 
  }
}