import axios from "axios";
import { AuthorizationService } from "./AuthorizationService";
import { UserInformation } from "../models/UserInformation";

const axiosClientInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClientInstance.interceptors.request.use(
  (config) => {
    const sessionValue = sessionStorage.getItem("UserInfo");
    if (!!sessionValue) {
      const userInfo = JSON.parse(sessionValue) as UserInformation;
      if (!!userInfo) {
        config.headers!.Authorization = `bearer ${userInfo.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClientInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        // Access Token is expired, refresh token
        originalConfig._retry = true;

        try {
          await AuthorizationService.RefreshToken().then(() => {
            AuthorizationService.GetCurrentUserInformation();
          });
          return axiosClientInstance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClientInstance;
