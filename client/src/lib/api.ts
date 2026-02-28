import axios from "axios";

export const api = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

export const logout = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};
