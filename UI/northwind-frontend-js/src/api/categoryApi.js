import api from "./api";

export const getCategory = async () => {
    return api.get(`/category`);
};

export const getCategoryById = async (id) => {
    return api.get(`/category/${id}`);
};

export const createCategory = async (data) => {
    return api.post(`/category`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const updateCategory = async (id, data) => {
    return api.put(`/category/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const deleteCategory = async (id) => {
    return api.delete(`/category/${id}`);
};