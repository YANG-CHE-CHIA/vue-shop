import axios from '@/axios'

export const getRuleList = (page) => axios.get(`/admin/rule/${page}`)

export const createRule = (data) => axios.post('/admin/rule',data)

export const updateRule = (id,data) => axios.post(`/admin/rule/${id}`,data)

export const updateRuleStatus = (id,status) => axios.post(`/admin/rule/${id}/update_status`,{ status });

export const deleteRule = (id) => axios.post(`/admin/rule/${id}/delete`);