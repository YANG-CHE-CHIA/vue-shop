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
export const getUserInfo = () => axios.post('/admin/getinfo');

//登出
export const logoutInfo = () => axios.post('/admin/logout');

//修改密碼
export const updatepassword = (data) => axios.post('/admin/updatepassword',data);

//管理員資訊
export const getManagerList = (page, params = { }) => axios.get(`/admin/manager/${page}`, { params });

//管理員狀態
export const updateManagerStatus = (id,status) => axios.post(`/admin/manager/${id}/update_status`,{ status });

//管理員新增
export const createManager = (data) => axios.post(`/admin/manager`,data);

//管理員修改
export const updateManager = (id,data) => axios.post(`/admin/manager/${id}`,data);

//管理員刪除
export const deleteManager = (id) => axios.post(`/admin/manager/${id}/delete`);
