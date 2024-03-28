import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LoginLambda {
  static async handler (event: LoginRequest): Promise<AuthenticateResponse> {
    const [user, token] = await new UserService().login(event.alias, event.password);
    
    let response: AuthenticateResponse = {
      success: true,
      message: "Login successful",
      user: user ? user.dto: null,
      token: token ? token.dto: null
    }
    
    return response;
  };
}

exports.loginHandler = LoginLambda.handler;