import {
  AuthTokenDto,
  FollowOrUnFollowRequest,
  FollowOrUnFollowResponse,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class FollowLambda {
  static async handler(
    event: any
  ): Promise<FollowOrUnFollowResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const followService = new FollowService(factory, authService);

    try {
      const request = FollowOrUnFollowRequest.fromJSON(event);

      const [followersCount, followeesCount] = await followService.follow(
        request.authToken,
        request.userToFollowOrUnFollow
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
