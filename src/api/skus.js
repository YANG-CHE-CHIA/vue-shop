import axios from '@/axios'

export const getSkusList = (page) => axios.get(`/admin/skus/${page}`)

export const createSkus = (data) => axios.post('/admin/skus',data)

export const updateSkus = (id,data) => axios.post(`/admin/skus/${id}`,data)

export function deleteSkus(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids
  return axios.post(`/admin/skus/delete_all`, { ids })
}

export const updateSkusStatus = (id,status) => axios.post(`/admin/skus/${id}/update_status`,{ status });

