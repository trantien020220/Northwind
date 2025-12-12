import api from "./api";

export const getSupplier = async () => {
    return api.get(`/suppliers`);
};

export const getSupplierById = async (id) => {
    return api.get(`/suppliers/${id}`);
};

export const createSupplier = async (data) => {
    return api.post(`/suppliers`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const updateSupplier = async (id, data) => {
    return api.put(`/suppliers/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const deleteSupplier = async (id) => {
    return api.delete(`/suppliers/${id}`);
};