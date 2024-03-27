import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LoginLambda {
  handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
    ///... returns a list of parameters which contains the user and the token
    let response = new AuthenticateResponse(
      ...(await new UserService().login(event.username, event.password))
    );
    return response;
  };
}