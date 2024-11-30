import axios from "axios";
// const BASE_URL = "https://lmds-backend-v2.fly.dev";
const BASE_URL = "http://127.0.0.1:3000/";

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});