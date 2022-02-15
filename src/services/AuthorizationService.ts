import axios from "axios";
import { UserInformation } from "../models/UserInformation";

export class AuthorizationService {
  public static GetCurrentUserInformation(): Promise<UserInformation | null> {
    const sessionValue = sessionStorage.getItem("UserInfo");
    if (!!sessionValue) {
      return Promise.resolve(JSON.parse(sessionValue) as UserInformation);
    } else {
      return axios
        .get<any>("/.auth/me", {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        })
        .then((response) => {
          if (response?.data.length > 0) {
            const userData = new UserInformation();
            userData.accessToken = response.data[0].access_token as string;
            userData.userId = response.data[0].user_id as string;

            sessionStorage.setItem("UserInfo", JSON.stringify(userData));

            return userData;
          }
          return null;
        })
        .catch((error) => {
          console.error(error);
          return null;
        });
    }
  }

  public static RefreshToken(): Promise<void> {
    return axios
      .get<void>(`/.auth/refresh`, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      })
      .then(() => {
        return;
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }
}
