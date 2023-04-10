import axios from "axios";

export const axiosRequest = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
});
