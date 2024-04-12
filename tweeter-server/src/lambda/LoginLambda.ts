import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class LoginLambda {
  static async handler(event: LoginRequest): Promise<AuthenticateResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const userService = new UserService(factory, authService);

    try {
      const [user, token] = await userService.login(
        event.alias,
        event.password
      );

      let response: AuthenticateResponse = {
        success: true,
        message: "Login successful",
        user: user ? user : null,
        token: token ? token: null,
      };

      return response;
    } catch (error) {
      console.error(error ? error : "An error occurred when logging in a user");
      throw error;
    }
  }
}

exports.handler = LoginLambda.handler;
