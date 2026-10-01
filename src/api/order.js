import axios from '@/axios'

//資訊
export const getOrderList = (page, params = { }) => axios.get(`/admin/order/${page}`, { params });

//匯出
export const exportOrder = (params = {}) => 
  axios.post('/admin/order/excelexport', {}, {
    params,
    responseType: 'blob'
  });

//刪除
export const deleteOrder = (ids) => axios.post(`/admin/order/delete_all`, { ids });

//物流訊息
export const getShipInfo = (id) => axios.get(`admin/order/${id}/get_ship_info`);

//同意or拒絕退款
export const refundOrder = (id,data) => axios.post(`/admin/order/${id}/handle_refund`, data);




