import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const authAPI = {
    register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
    login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
};

export const userAPI = {
    getAllPatients: () => axios.get(`${API_BASE_URL}/users/patients`),
    getAllDoctors: () => axios.get(`${API_BASE_URL}/users/doctors`),
    getUserById: (userId, token) =>
        axios.get(`${API_BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    updateProfile: (userId, data, token) =>
        axios.put(`${API_BASE_URL}/users/${userId}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};

export const appointmentAPI = {
    bookAppointment: (data, token) =>
        axios.post(`${API_BASE_URL}/appointments/book`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    getAppointments: (userId, role, token) =>
        axios.get(`${API_BASE_URL}/appointments?userId=${userId}&role=${role}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    getAppointmentById: (appointmentId, token) =>
        axios.get(`${API_BASE_URL}/appointments/${appointmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    updateAppointment: (appointmentId, data, token) =>
        axios.put(`${API_BASE_URL}/appointments/${appointmentId}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    approveAppointment: (appointmentId, token) =>
        axios.put(`${API_BASE_URL}/appointments/${appointmentId}`,
            { status: 'confirmed' },
            { headers: { Authorization: `Bearer ${token}` } }
        ),
    rejectAppointment: (appointmentId, data, token) =>
        axios.put(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    cancelAppointment: (appointmentId, data, token) =>
        axios.put(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    deleteAppointment: (appointmentId, token) =>
        axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};
