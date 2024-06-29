import axios from "axios";
const BASE_URL = "https://lmds-backend-v2.fly.dev";

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});