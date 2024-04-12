import { LoadMoreFollowItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreFollowItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class LoadMoreFollowersLambda {
  static async handler(event: any): Promise<LoadMoreFollowItemsResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);
    const followService = new FollowService(factory, authService);

    try {
      event = LoadMoreFollowItemsRequest.fromJSON(event);

      const [followers, hasMore] = await followService.loadMoreFollowers(
        event.authToken,
        event.user,
        event.pageSize,
        event.lastItem
      );

      let response = {
        success: true,
        message: "Successfully loaded more followers.",
        users: followers ? followers : [],
        hasMorePages: hasMore,
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when loading more followers."
      );
      throw error;
    }
  }
}

exports.handler = LoadMoreFollowersLambda.handler;
