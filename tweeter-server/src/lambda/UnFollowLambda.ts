import {
  FollowOrUnFollowRequest,
  FollowOrUnFollowResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class UnFollowLambda {
  static async handler(
    event: FollowOrUnFollowRequest
  ): Promise<FollowOrUnFollowResponse> {
    try {
      const [followersCount, followeesCount] =
        await new FollowService().unfollow(
          event.authToken,
          event.userToFollowOrUnFollow
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
