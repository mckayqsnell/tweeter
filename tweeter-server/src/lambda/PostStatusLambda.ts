import { PostStatusRequest } from "tweeter-shared/dist/model/net/Request";
import { PostStatusResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class PostStatusLambda {
  static async handler(event: any): Promise<PostStatusResponse> {
    
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);
    const statusService = new StatusService(factory, authService);

    try {
      event = PostStatusRequest.fromJSON(event);

      await statusService.postStatus(event.authToken, event.newStatus);
      let response: PostStatusResponse = {
        success: true,
        message: "Post status successful",
      };
      return response;
    } catch (error) {
      console.error(error ? error : "An error occurred when posting a status");
      throw error;
    }
  }
}

exports.handler = PostStatusLambda.handler;
