import axios from '@/axios'

export const getImageList = (id,page = 1) => axios.get(`/admin/image_class/${id}/image/${page}`)

export const updateImage = (id,name) => axios.post(`/admin/image/${id}`,{ name })

export const deleteImage = (ids) => axios.post(`/admin/image/delete_all`,{ ids })

export const uploadImageAction = '/api/admin/image/upload'