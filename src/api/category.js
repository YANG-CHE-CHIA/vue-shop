import axios from '@/axios'

//列表
export const getCategoryList = () => axios.get(`/admin/category`);

//新增
export const createCategory = (data) => axios.post('/admin/category',data)

//修改
export const updateCategory = (id,data) => axios.post(`/admin/category/${id}`,data)

//修改狀態
export const updateCategoryStatus = (id,status) => axios.post(`/admin/category/${id}/update_status`,{ status });

//刪除
export const deleteCategory = (id) => axios.post(`/admin/category/${id}/delete`);

//分類列表
export const getCategoryGoods = (id) => axios.get(`/admin/app_category_item/list?category_id=${id}`);

//刪除關聯產品
export const deleteCategoryGoods = (id) => axios.post(`/admin/app_category_item/${id}/delete`);

//關聯產品
export const connectCategoryGoods = (data) => axios.post(`/admin/app_category_item`,data);


