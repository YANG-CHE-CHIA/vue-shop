import axios from '@/axios'

export const getRoleList = (page) => axios.get(`/admin/role/${page}`)

export const createRole = (data) => axios.post('/admin/role',data)

export const updateRole = (id,data) => axios.post(`/admin/role/${id}`,data)

export const deleteRole = (id) => axios.post(`/admin/role/${id}/delete`)

export const updateRoleStatus = (id,status) => axios.post(`/admin/role/${id}/update_status`,{ status });

export const setRoleRules = (id,rule_ids) => axios.post(`/admin/role/set_rules`,{ id,rule_ids })
