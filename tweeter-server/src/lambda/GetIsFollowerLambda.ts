import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class GetIsFollowerLambda {
  static async handler(
    event: GetIsFollowerStatusRequest
  ): Promise<GetIsFollowerStatusResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const followService = new FollowService(factory);

    try {
      const isFollower = await followService.getIsFollowerStatus(
        event.authToken,
        event.user,
        event.selectedUser
      );

      let response = {
        success: true,
        message: "Get is follower successful",
        isFollower: isFollower,
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when getting is follower status"
      );
      throw error;
    }
  }
}

exports.handler = GetIsFollowerLambda.handler;
