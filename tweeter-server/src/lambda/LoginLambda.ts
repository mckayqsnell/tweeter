import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class LoginLambda {
  static async handler(event: LoginRequest): Promise<AuthenticateResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const userService = new UserService(factory);

    try {
      const [user, token] = await userService.login(
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
