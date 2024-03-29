import { LoadMoreStatusItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreStatusItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";

export class LoadMoreStoryItemsLambda {
  static async handler(event: any): Promise<LoadMoreStatusItemsResponse> {
    console.log("LoadMoreStoryItemsLambda.handler: event = ", event);
    // deserialize the event into a LoadMoreStatusItemsRequest
    event = LoadMoreStatusItemsRequest.fromJSON(event);

    console.log("LoadMoreStoryItemsRequest deserialized")
    console.log("LoadMoreStoryItemsLambda.handler: event = ", event);

    if (!event.authToken || !event.user) {
      return {
        success: false,
        message: "Request is missing required fields",
        statusItems: [],
        hasMorePages: false
      };
    }

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