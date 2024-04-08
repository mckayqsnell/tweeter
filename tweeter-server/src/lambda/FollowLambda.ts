import {
  FollowOrUnFollowRequest,
  FollowOrUnFollowResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class FollowLambda {
  static async handler(
    event: FollowOrUnFollowRequest
  ): Promise<FollowOrUnFollowResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const followService = new FollowService(factory);

    try {
      const [followersCount, followeesCount] = await followService.follow(
        event.authToken,
        event.userToFollowOrUnFollow
      );

      let response = {
        success: true,
        message: "Follow successful",
        followersCount: followersCount,
        followeesCount: followeesCount,
      };
      return response;
    } catch (error) {
      console.error(error ? error : "An error occurred when following a user");
      throw error;
    }
  }
}

exports.handler = FollowLambda.handler;
