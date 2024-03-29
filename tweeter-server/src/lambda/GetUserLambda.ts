import { GetUserReponse } from "tweeter-shared";
import { GetUserRequest } from "tweeter-shared/dist/model/net/Request";
import { UserService } from "../model/service/UserService";

export class GetUserLambda {
  static async handler(event: GetUserRequest): Promise<GetUserReponse> {
    try {
      const user = await new UserService().getUser(
        event.authToken,
        event.alias
      );

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
