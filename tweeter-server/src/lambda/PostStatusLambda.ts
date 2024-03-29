import { PostStatusRequest } from "tweeter-shared/dist/model/net/Request";
import { PostStatusResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";

export class PostStatusLambda {
  static async handler(event: any): Promise<PostStatusResponse> {
    try {
      event = PostStatusRequest.fromJSON(event);

      await new StatusService().postStatus(event.authToken, event.newStatus);
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
