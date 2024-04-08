import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class GetFollowersCountLambda {
  static async handler(
    event: GetFollowCountRequest
  ): Promise<GetFollowCountResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const followService = new FollowService(factory);

    try {
      const count = await followService.getFollowersCount(
        event.authToken,
        event.user
      );

      let response = {
        success: true,
        message: "Get followers count successful",
        count: count,
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when getting followers count"
      );
      throw error;
    }
  }
}

exports.handler = GetFollowersCountLambda.handler;
