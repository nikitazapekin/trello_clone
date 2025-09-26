import { ENV_CONSTANTS } from "@constants/envConstants";
import axios from "axios";

export const $api = axios.create({
  baseURL: ENV_CONSTANTS.APP_API_URL,
});

export const $api2 = axios.create({
  baseURL: ENV_CONSTANTS.API_GOOGLE_AUTH,
});

$api.interceptors.request.use((config) => {
  return config;
});

$api2.interceptors.request.use((config) => {
  return config;
});
