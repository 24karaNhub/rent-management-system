import API from './api'

export const getLandlords = () => API.get('/landlord')

export const addLandlord = (data) => API.post('/landlord', data)
export const getLandlordById = (id) => API.get(`/landlord/${id}`)
export const getPropertiesByLandlord = (id) => API.get(`/property/landlord/${id}`)
export const getTenantsByLandlord = (id) => API.get(`/tenant/landlord/${id}`)