import axios from "axios";
import { axiosPrivate } from "../api/Axios";

const userAxiosPrivate = () => {
  const requestIntercept = axiosPrivate.interceptors.request.use(
    (request) => {
      return request;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  return axiosPrivate;
};

export default userAxiosPrivate;
