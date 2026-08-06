import axios from '@/axios'

export const getCouponList = (page) => axios.get(`/admin/coupon/${page}`)

export const createCoupon = (data) => axios.post('/admin/coupon',data)

export const updateCoupon = (id,data) => axios.post(`/admin/coupon/${id}`,data)

export const deleteCoupon = (id) => axios.post(`/admin/coupon/${id}/delete`)

export const updateCouponStatus = (id) => axios.post(`/admin/coupon/${id}/update_status`,{ status: 0 })

