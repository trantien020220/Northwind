import api from "./api";

export const getProducts = async () => {
    return api.get(`/products`);
};

export const getProductById = async (id) => {
    return api.get(`/products/${id}`);
};

export const createProduct = async (data) => {
    return api.post(`/products`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const updateProduct = async (id, data) => {
    return api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const deleteProduct = async (id) => {
    return api.delete(`/products/${id}`);
};