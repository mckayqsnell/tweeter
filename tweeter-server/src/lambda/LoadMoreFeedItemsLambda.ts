import { LoadMoreStatusItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreStatusItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";

export class LoadMoreFeedItemsLambda {
  static async handler(event: any): Promise<LoadMoreStatusItemsResponse> {
    try {
      event = LoadMoreStatusItemsRequest.fromJSON(event);

      const [feedItems, hasMorePages] =
        await new StatusService().loadMoreFeedItems(
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
