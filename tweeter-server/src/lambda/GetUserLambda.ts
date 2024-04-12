import { AuthTokenDto, GetUserReponse, UserDto } from "tweeter-shared";
import { GetUserRequest } from "tweeter-shared/dist/model/net/Request";
import { UserService } from "../model/service/UserService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class GetUserLambda {
  static async handler(event: any): Promise<GetUserReponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const userService = new UserService(factory, authService);

    try {
      const request = GetUserRequest.fromJSON(event);
      const user = await userService.getUser(request.authToken, request.alias);

      let response: GetUserReponse = {
        success: true,
        message: "Get user successful",
        user: user ? user : null,
      };

      return response;
    } catch (error) {
      console.error(error ? error : "An error occurred when getting a user");
      throw error;
    }
  }
}

exports.handler = GetUserLambda.handler;
