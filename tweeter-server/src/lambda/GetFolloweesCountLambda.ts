import { AuthTokenDto, GetFollowCountRequest, GetFollowCountResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class GetFolloweesCountLambda {
  static async handler(
    event: any
  ): Promise<GetFollowCountResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const followService = new FollowService(factory, authService);

    console.log("GetFolloweesCountLambda event: ", event)

    try {
      const request = GetFollowCountRequest.fromJSON(event);
      
      const count = await followService.getFolloweesCount(
        request.authToken,
        request.user
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
