import {
  LoadMoreFollowItemsRequest,
  LoadMoreFollowItemsResponse,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";

export class LoadMoreFolloweesLambda {
  static async handler(event: any): Promise<LoadMoreFollowItemsResponse> {
    const factory = DynamoDBDAOFactory.getInstance();

    const followService = new FollowService(factory);

    try {
      // deserialize the event into a LoadMoreFollowItemsRequest
      event = LoadMoreFollowItemsRequest.fromJSON(event);

      const [followees, hasMorePages] = await followService.loadMoreFollowees(
        event.authToken,
        event.user,
        event.pageSize,
        event.lastItem
      );

      let response = {
        success: true,
        message: "Load more followees successful",
        users: followees.map((user) => user.dto),
        hasMorePages: hasMorePages,
      };

      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when loading more followees"
      );
      throw error;
    }
  }
}

exports.handler = LoadMoreFolloweesLambda.handler;
