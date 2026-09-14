import axios from '@/axios'

export const getCommentList = (page, params = { }) => axios.get(`/admin/goods_comment/${page}`, { params });

export const updateCommentStatus = (id,status) => axios.post(`/admin/goods_comment/${id}/update_status`,{ status });

export const reviewComment = (id,data) => axios.post(`/admin/goods_comment/review/${id}`,{ data });
