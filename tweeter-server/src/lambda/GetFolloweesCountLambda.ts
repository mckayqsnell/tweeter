import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class GetFolloweesCountLambda {
  static async handler(
    event: GetFollowCountRequest
  ): Promise<GetFollowCountResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const followService = new FollowService(factory);

    try {
      const count = await followService.getFolloweesCount(
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
