import { AuthTokenDto } from "tweeter-shared";
import { AuthTokenDB } from "../../DatabaseTypes";

export interface IAuthTokenDAO {
  getToken(token: string): Promise<AuthTokenDB>;
  storeToken(authTokenDB: AuthTokenDB): Promise<void>;
  deleteToken(token: string): Promise<void>;
}
