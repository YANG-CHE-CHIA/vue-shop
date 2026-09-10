import axios from '@/axios'

export const getUserLevelList = (page) => axios.get(`/admin/user_level/${page}`)

export const createUserLevel = (data) => axios.post('/admin/user_level',data)

export const updateUserLevel = (id,data) => axios.post(`/admin/user_level/${id}`,data)

export const deleteUserLevel = (id) => axios.post(`/admin/user_level/${id}/delete`)

export const updateUserLevelStatus = (id,status) => axios.post(`/admin/user_level/${id}/update_status`,{ status });
