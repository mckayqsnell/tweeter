import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LoginLambda {
  static async handler(event: LoginRequest): Promise<AuthenticateResponse> {
    try {
      const [user, token] = await new UserService().login(
        event.alias,
        event.password
      );

      let response: AuthenticateResponse = {
        success: true,
        message: "Login successful",
        user: user ? user.dto : null,
        token: token ? token.dto : null,
      };

      return response;
    } catch (error) {
      console.error(error ? error : "An error occurred when logging in a user");
      throw error;
    }
  }
}

exports.handler = LoginLambda.handler;
