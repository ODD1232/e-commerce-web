import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export function setAuth(token) {
  API.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export default API;
