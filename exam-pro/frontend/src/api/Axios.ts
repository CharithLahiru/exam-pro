import axios from "axios";
// const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://localhost:5173/exam-pro";

/**
 * used to send public requests those are not required authentication
 */
export default axios.create({
  baseURL: BASE_URL,
});

/**
 * used to send private requests those are required authentication.
 */
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
