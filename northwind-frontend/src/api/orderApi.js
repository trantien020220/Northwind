import api from "./api";

export const getOrders = async () => {
    return api.get(`/orders`);
};

export const getOrderById = async (id) => {
    return api.get(`/orders/${id}`);
};

export const createOrder = async (data) => {
    return api.post(`/orders`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const updateOrder = async (id, data) => {
    return api.put(`/orders/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const deleteOrder = async (id) => {
    return api.delete(`/orders/${id}`);
};

export const getOrderDetails = async (id) => {
    return api.get(`/orderdetails/${id}`);
};
