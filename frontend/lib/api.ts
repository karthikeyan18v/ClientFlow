import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// Admin
export const getDashboard = () => api.get("/admin/dashboard");
export const getAdminEmployees = () => api.get("/admin/employees");
export const getAdminClients = () => api.get("/admin/clients");
export const getAdminProjects = () => api.get("/admin/projects");
export const createAdminProject = (data: object) => api.post("/admin/projects", data);
export const updateAdminProject = (id: string, data: object) => api.put(`/admin/projects/${id}`, data);
export const deleteAdminProject = (id: string) => api.delete(`/admin/projects/${id}`);
export const updateAdminProfile = (data: object) => api.put("/admin/profile", data);
export const getAdminProfile = () => api.get("/admin/profile");

// Users
export const getUsers = () => api.get("/users");
export const createUser = (data: object) => api.post("/users", data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

// Services
export const getServices = () => api.get("/services");
export const createService = (data: object) => api.post("/services", data);
export const deleteService = (id: string) => api.delete(`/services/${id}`);

// Service Requests
export const getRequests = () => api.get("/requests");
export const getMyRequests = () => api.get("/requests/my");
export const createClientRequest = (data: object) => api.post("/requests", data);
export const approveRequest = (id: string) => api.put(`/requests/${id}/approve`);
export const rejectRequest = (id: string, reason: string) =>
  api.put(`/requests/${id}/reject`, { reason });

// Projects (assign)
export const assignEmployees = (id: string, employeeIds: string[]) =>
  api.put(`/projects/${id}/assign`, { employeeIds });

// Employee
export const getEmployeeProjects = () => api.get("/employee/projects");
export const updateProjectStatus = (id: string, status: string) =>
  api.put(`/employee/projects/${id}/status`, { status });
export const getEmployeeClients = () => api.get("/employee/clients");
export const updateEmployeeProfile = (data: object) => api.put("/employee/profile", data);
export const getEmployeeProfile = () => api.get("/employee/profile");

// Client
export const getClientProjects = () => api.get("/client/projects");
export const getClientEmployees = () => api.get("/client/employees");
export const updateClientProfile = (data: object) => api.put("/client/profile", data);
export const getClientProfile = () => api.get("/client/profile");

// Messages
export const getContacts = () => api.get("/messages/contacts");
export const getInbox = () => api.get("/messages/inbox");
export const getConversation = (userId: string) => api.get(`/messages/${userId}`);
export const sendMessage = (receiverId: string, content: string) =>
  api.post("/messages", { receiverId, content });

export default api;
