import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class LogoutLambda {
  static async handler(event: LogoutRequest): Promise<LogoutResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);
    const userService = new UserService(factory, authService);

    try {
      await userService.logout(event.authToken);

      let response = {
        success: true,
        message: "Logout successful",
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when logging out a user"
      );
      throw error;
    }
  }
}

exports.handler = LogoutLambda.handler;
