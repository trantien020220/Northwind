import api from "./api";

export const getCustomer = async (id) => {
    return api.get(`/customers/`);
};

export const getCustomerById = async (id) => {
    return api.get(`/customers/${id}`);
};

export const createCustomer = async (data) => {
    return api.post(`/customers/`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const updateCustomer = async (id, data) => {
    return api.put(`/customers/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const deleteCustomer = async (id) => {
    return api.delete(`/customers/${id}`);
};