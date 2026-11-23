import axios from '@/axios'

export const getAgentStatistics = () => axios.get(`/admin/agent/statistics`)

export const getAgentList = (page, params = { }) => axios.get(`/admin/agent/${page}`, { params });

export const getAgentOrderList = (page, params = { }) => axios.get(`/admin/user_bill/${page}`, { params });

export const getConfig = () => axios.get(`/admin/distribution_setting/get`);

export const setConfig = (data) => axios.post(`/admin/distribution_setting/set`,data);

