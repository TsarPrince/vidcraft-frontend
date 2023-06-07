import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const instance = axios.create({
  baseURL: BACKEND_URL,
});

export default instance