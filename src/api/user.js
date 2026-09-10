import axios from '@/axios'

export const getUserList = (page, params = { }) => axios.get(`/admin/user/${page}`, { params });

export const updateUserStatus = (id,status) => axios.post(`/admin/user/${id}/update_status`,{ status });

export const createUser = (data) => axios.post(`/admin/user`,data);

export const updateUser = (id,data) => axios.post(`/admin/user/${id}`,data);

export const deleteUser = (id) => axios.post(`/admin/user/${id}/delete`);
