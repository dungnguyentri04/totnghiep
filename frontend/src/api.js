import axios from 'axios'

// URL của backend Spring Boot.
// Khi build production, đặt biến môi trường VITE_API_URL (xem README) trỏ tới domain/IP server của bạn.
// Ví dụ: VITE_API_URL=http://123.45.67.89:8080/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const registerGuest = (data) => axios.post(`${API_URL}/guests`, data)
export const getGuests = () => axios.get(`${API_URL}/guests`)
export const getGuestCount = () => axios.get(`${API_URL}/guests/count`)
export const deleteGuest = (id) => axios.delete(`${API_URL}/guests/${id}`)
