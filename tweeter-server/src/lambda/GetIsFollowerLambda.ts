import {
  AuthTokenDto,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class GetIsFollowerLambda {
  static async handler(
    event: any
  ): Promise<GetIsFollowerStatusResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const followService = new FollowService(factory, authService);

    try {
      const request = GetIsFollowerStatusRequest.fromJSON(event);

      const isFollower = await followService.getIsFollowerStatus(
        request.authToken,
        request.user,
        request.selectedUser
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
