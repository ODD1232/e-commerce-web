import axios from "axios";

const baseURL = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "") + "/api/";

const API = axios.create({ baseURL });

export function setAuth(token) {
  API.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export default API;
