import axios from '@/axios'

export const getImageClassList = (page) => axios.get(`/admin/image_class/${page}`)

export const createImageClass = (data) => axios.post('/admin/image_class',data)

export const updateImageClass = (id,data) => axios.post(`/admin/image_class/${id}`,data)

export const deleteImageClass = (id) => axios.post(`/admin/image_class/${id}/delete`)
