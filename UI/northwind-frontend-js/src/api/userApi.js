import api from "./api";

export const userRegister = (data) =>
    api.post(`/auth/register`, data);

export const userLogin = (data) =>
    api.post(`auth/login`, data);

export const getUsers = () =>
    api.get(`/users`);

export const getOwnUsers = () =>
    api.get(`/users/me`);

export const getUserId = (id) =>
    api.get(`/users/${id}`);

export const updateUserRole = (id, role) =>
    api.put(`/users/${id}/role`, { role })

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);

export const Update = (id) =>
    api.put(`/users/${id}`);