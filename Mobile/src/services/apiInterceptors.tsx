import axios from "axios";
import { BASE_URL } from "./config";

export const appAxios = axios.create({
    baseURL : BASE_URL
})

appAxios.interceptors.request