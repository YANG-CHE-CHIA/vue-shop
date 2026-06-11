import axios from '@/axios'


export const getStatistics1 = () => axios.get('/admin/statistics1')

export const getStatistics2 = () => axios.get('/admin/statistics2')

export const getStatistics3 = (type) => axios.get(`/admin/statistics3?type=${type}`)