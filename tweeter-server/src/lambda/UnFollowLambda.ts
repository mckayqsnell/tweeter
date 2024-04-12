import {
  FollowOrUnFollowRequest,
  FollowOrUnFollowResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class UnFollowLambda {
  static async handler(
    event: any
  ): Promise<FollowOrUnFollowResponse> {
    
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);
    const followService = new FollowService(factory, authService);

    try {
      const request = FollowOrUnFollowRequest.fromJSON(event);
      const [followersCount, followeesCount] = await followService.unfollow(
        request.authToken,
        request.userToFollowOrUnFollow
      );

      let response = {
        success: true,
        message: "Unfollow successful",
        followersCount: followersCount,
        followeesCount: followeesCount,
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when unfollowing a user"
      );
      throw error;
    }
  }
}

exports.handler = UnFollowLambda.handler;
