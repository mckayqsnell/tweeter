import { LoadMoreStatusItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreStatusItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class LoadMoreFeedItemsLambda {
  static async handler(event: any): Promise<LoadMoreStatusItemsResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const statusService = new StatusService(factory, authService);
    
    try {
      event = LoadMoreStatusItemsRequest.fromJSON(event);

      const [feedItems, hasMorePages] = await statusService.loadMoreFeedItems(
        event.authToken,
        event.user,
        event.pageSize,
        event.lastItem
      );

      let response: LoadMoreStatusItemsResponse = {
        success: true,
        message: "Load more feed items successful",
        statusItems: feedItems.map((feedItem) => feedItem.dto),
        hasMorePages: hasMorePages,
      };

      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when loading more feed items"
      );
      throw error;
    }
  }
}

exports.handler = LoadMoreFeedItemsLambda.handler;
