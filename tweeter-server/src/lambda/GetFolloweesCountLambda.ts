import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFolloweesCountLambda {
  static async handler(
    event: GetFollowCountRequest
  ): Promise<GetFollowCountResponse> {
    try {
      const count = await new FollowService().getFolloweesCount(
        event.authToken,
        event.user
      );

      let response = {
        success: true,
        message: "Get followees count successful",
        count: count,
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when getting followees count"
      );
      throw error;
    }
  }
}

exports.handler = GetFolloweesCountLambda.handler;
