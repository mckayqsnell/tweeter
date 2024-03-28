import { LoadMoreStatusItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreStatusItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";

export class LoadMoreStoryItemsLambda {
  static async handler(event: LoadMoreStatusItemsRequest): Promise<LoadMoreStatusItemsResponse> {
    const [storyItems, hasMorePages] = await new StatusService().loadMoreStoryItems(event.authToken, event.user, event.pageSize, event.lastItem);

    let response: LoadMoreStatusItemsResponse = {
      success: true,
      message: "Load more story items successful",
      statusItems: storyItems.map(storyItem => storyItem.dto),
      hasMorePages: hasMorePages
    };

    return response;
  }
}

exports.handler = LoadMoreStoryItemsLambda.handler;