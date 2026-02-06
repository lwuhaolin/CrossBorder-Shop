import axios from "axios";

const SUCCESS_CODE = 0;
const TIMEOUT = 5000;
const API_HOST = "http://127.0.0.1:1216";

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  withCredentials: true,
});

instance.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      if (data.code === SUCCESS_CODE) {
        return data;
      }
      return Promise.reject(data);
    }
    return Promise.reject(response?.data);
  },
  (e) => Promise.reject(e)
);

export default instance;
