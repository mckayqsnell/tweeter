import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class LogoutLambda {
  static async handler(event: LogoutRequest): Promise<LogoutResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const userService = new UserService(factory);

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
