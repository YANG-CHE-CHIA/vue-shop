import axios from '@/axios'

//資訊
export const getGoodsList = (page, params = { }) => axios.get(`/admin/goods/${page}`, { params });

//批量上下架
export const updateGoodsStatus = (ids,status) => axios.post(`/admin/goods/changestatus`,{ ids,status });

//新增
export const createGoods = (data) => axios.post(`/admin/goods`,data);

//修改
export const updateGoods = (id,data) => axios.post(`/admin/goods/${id}`,data);

//刪除
export const deleteGoods = (ids) => axios.post(`/admin/goods/delete_all`, { ids });

//讀取資料
export const readGoods = (id) => axios.get(`/admin/goods/read/${id}`);

//設置商品輪播圖
export const setGoodsBanner = (id,data) => axios.post(`/admin/goods/banners/${id}`,data);
