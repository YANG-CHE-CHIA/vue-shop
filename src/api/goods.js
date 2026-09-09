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

//徹底刪除的商品
export const destroyGoods = (ids) => axios.post(`/admin/goods/destroy`, { ids });

//批量恢復刪除的商品
export const restoreGoods = (ids) => axios.post(`/admin/goods/restore`, { ids });

//讀取資料
export const readGoods = (id) => axios.get(`/admin/goods/read/${id}`);

//設置商品輪播圖
export const setGoodsBanner = (id,data) => axios.post(`/admin/goods/banners/${id}`,data);

//更新商品规格
export const updateGoodsSkus = (id,data) => axios.post(`/admin/goods/updateskus/${id}`,data);

//新增商品规格
export const createGoodsSkusCard = (data) => axios.post(`/admin/goods_skus_card`,data);

//修改商品规格選項
export const updateGoodsSkusCard = (id,data) => axios.post(`/admin/goods_skus_card/${id}`,data);

//刪除商品规格選項
export const deleteGoodsSkusCard = (id) => axios.post(`/admin/goods_skus_card/${id}/delete`);

//排序商品规格選項
export const sortGoodsSkusCard = (data) => axios.post(`/admin/goods_skus_card/sort`,data);

//添加商品選項規格的值
export const createGoodsSkusCardValue = (data) => axios.post(`/admin/goods_skus_card_value`,data);

//修改商品選項規格的值
export const updateGoodsSkusCardValue = (id,data) => axios.post(`/admin/goods_skus_card_value/${id}`,data);

//刪除商品選項規格的值
export const deleteGoodsSkusCardValue = (id) => axios.post(`/admin/goods_skus_card_value/${id}/delete`);

//選擇設置商品規格選項和值
export const chooseAndSetGoodsSkusCard = (id,data) => axios.post(`/admin/goods_skus_card/${id}/set`,data)



