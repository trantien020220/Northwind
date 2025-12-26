// src/api/userApi.js
import api from "./api";

export const userRegister = async (data) => {
    return api.post(`/auth/register`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const userLogin = async (data) => {
    return api.post(`/auth/login`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const getUsers = async () => {
    return api.get(`/users`);
};

export const getOwnUser = async () => {
    return api.get(`/users/me`);
};

export const getUserById = async (id) => {
    return api.get(`/users/${id}`);
};

export const updateUser = async (id, data) => {
    return api.put(`/users/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const updateUserRole = async (id, role) => {
    return api.put(`/users/${id}/role`, { role }, {
        headers: { "Content-Type": "application/json" }
    });
};

export const deleteUser = async (id) => {
    return api.delete(`/users/${id}`);
};

export const changePassword = async (data) => {
    return api.post(`/auth/change-password`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

export const resetPassword = async (id, data) => {
    return api.post(`/users/${id}/reset-password`, data, {
        headers: { "Content-Type": "application/json" }
    });
};