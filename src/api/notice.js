import axios from '@/axios'

export const getNoticeList = (page) => axios.get(`/admin/notice/${page}`)

export const createNotice = (data) => axios.post('/admin/notice',data)

export const updateNotice = (id,data) => axios.post(`/admin/notice/${id}`,data)

export const deleteNotice = (id) => axios.post(`/admin/notice/${id}/delete`)

