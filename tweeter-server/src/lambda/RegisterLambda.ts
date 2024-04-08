import { AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { RegisterRequest } from "tweeter-shared/dist/model/net/Request";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class RegisterLambda {
  static async handler(event: RegisterRequest): Promise<AuthenticateResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const userService = new UserService(factory);

    try {
      const [user, token] = await userService.register(
        event.firstName,
        event.lastName,
        event.alias,
        event.password,
        event.imageStringBase64
      );

      let response: AuthenticateResponse = {
        success: true,
        message: "Login successful",
        user: user ? user.dto : null,
        token: token ? token.dto : null,
      };

      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when registering a user"
      );
      throw error;
    }
  }
}

exports.handler = RegisterLambda.handler;
