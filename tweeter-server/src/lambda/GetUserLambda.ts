import { GetUserReponse } from "tweeter-shared";
import { GetUserRequest } from "tweeter-shared/dist/model/net/Request";
import { UserService } from "../model/service/UserService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class GetUserLambda {
  static async handler(event: GetUserRequest): Promise<GetUserReponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const userService = new UserService(factory);

    try {
      const user = await userService.getUser(event.authToken, event.alias);

      let response: GetUserReponse = {
        success: true,
        message: "Get user successful",
        user: user ? user.dto : null,
      };

      return response;
    } catch (error) {
      console.error(error ? error : "An error occurred when getting a user");
      throw error;
    }
  }
}

exports.handler = GetUserLambda.handler;
