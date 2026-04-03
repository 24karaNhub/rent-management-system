import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// PROPERTIES
export const getAllProperties = () => API.get("/property").then(r => r.data);
export const getPropertyById = (id) => API.get(`/property/${id}`).then(r => r.data);
export const createProperty = (data) => API.post("/property", data).then(r => r.data);
export const updateProperty = (id, data) => API.put(`/property/${id}`, data).then(r => r.data);
export const deleteProperty = (id) => API.delete(`/property/${id}`).then(r => r.data);
export const getPropertiesByLandlord = (id) => API.get(`/property/landlord/${id}`).then(r => r.data);
export const getTenantsOfProperty = (id) =>
  API.get(`/property/${id}/tenants`).then(r => r.data);
export const getPaymentsOfProperty = (id) =>
  API.get(`/property/${id}/payments`).then(r => r.data);

// TENANTS
export const getAllTenants = () => API.get("/tenants").then(r => r.data);
export const getTenantById = (id) => API.get(`/tenants/${id}`).then(r => r.data);
export const getPaymentsOfTenant = (id) =>
  API.get(`/tenants/${id}/payments`).then(r => r.data);
export const getTenantsByLandlord = (id) => API.get(`/tenants/landlord/${id}`).then(r => r.data);
export const createTenant = (data) => API.post("/tenants", data).then(r => r.data);
export const updateTenant = (id, data) => API.put(`/tenants/${id}`, data).then(r => r.data);
export const deleteTenant = (id) => API.delete(`/tenants/${id}`).then(r => r.data);

// PAYMENTS
export const getAllPayments = () => API.get("/rent-payments").then(r => r.data);
export const getPaymentsByTenant = (tenantId) => API.get(`/rent-payments/tenant/${tenantId}`).then(r => r.data);
export const getPaymentsByMonth = (month, year) => API.get("/rent-payments", { params: { month, year } }).then(r => r.data);
export const createPayment = (data) => API.post("/rent-payments", data).then(r => r.data);
export const updatePayment = (id, data) => API.put(`/rent-payments/${id}`, data).then(r => r.data);
export const getPaymentById = (id) =>
  API.get(`/rent-payments/${id}`).then(r => r.data);

// LANDLORDS
export const getAllLandlords = () => API.get("/landlord").then(r => r.data);
export const getLandlordById = (id) => API.get(`/landlord/${id}`).then(r => r.data);
export const createLandlord = (data) => API.post("/landlord", data).then(r => r.data);
export const updateLandlord = (id, data) => API.put(`/landlord/${id}`, data).then(r => r.data);
export const deleteLandlord = (id) => API.delete(`/landlord/${id}`).then(r => r.data);

// AUTH
export const loginClient = (data) => API.post("/auth/login", data).then(r => r.data);
export const signupClient = (data) => API.post("/auth/signup", data).then(r => r.data);


export default API;
