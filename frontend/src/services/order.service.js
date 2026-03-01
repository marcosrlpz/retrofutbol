import api from "./auth.service";

export const createOrderService = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};
export const getMyOrdersService = async () => {
  const { data } = await api.get("/orders/my-orders");
  return data;
};
export const getOrderByIdService = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};
export const getAllOrdersService = async () => {
  const { data } = await api.get("/orders");
  return data;
};
export const updateOrderStatusService = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};
export const markAsDeliveredService = async (id) => {
  const { data } = await api.put(`/orders/${id}/delivered`);
  return data;
};
export const cancelOrderService = async (id) => {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data;
};