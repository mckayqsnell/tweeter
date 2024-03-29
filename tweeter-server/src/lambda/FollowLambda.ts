import {
  FollowOrUnFollowRequest,
  FollowOrUnFollowResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class FollowLambda {
  static async handler(
    event: FollowOrUnFollowRequest
  ): Promise<FollowOrUnFollowResponse> {
    try {
      const [followersCount, followeesCount] = await new FollowService().follow(
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
