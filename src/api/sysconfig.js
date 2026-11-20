import axios from '@/axios'

export const getSysconfig = () => axios.get(`/admin/sysconfig`);

export const setSysconfig = (data) => axios.post(`/admin/sysconfig`,data);

export const uploadAction = '/api/admin/sysconfig/upload'