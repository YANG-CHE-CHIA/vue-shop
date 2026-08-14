import axios from '@/axios'

export const getCategoryList = () => axios.get(`/admin/category`);