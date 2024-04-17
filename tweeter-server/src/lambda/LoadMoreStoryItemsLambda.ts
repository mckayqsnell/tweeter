import { LoadMoreStatusItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreStatusItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { AuthService } from "../model/service/AuthService";

export class LoadMoreStoryItemsLambda {
  static async handler(event: any): Promise<LoadMoreStatusItemsResponse> {
    const factory = DynamoDBDAOFactory.getInstance();
    const authService = new AuthService(factory);

    const statusService = new StatusService(factory, authService);

    console.log("Received event:", JSON.stringify(event, null, 2));

    try {
      // deserialize the event into a LoadMoreStatusItemsRequest
      event = LoadMoreStatusItemsRequest.fromJSON(event);
      console.log("Deserialized event:", JSON.stringify(event, null, 2));

      const [storyItems, hasMorePages] = await statusService.loadMoreStoryItems(
        event.authToken,
        event.user,
        event.pageSize,
        event.lastItem
      );

      let response: LoadMoreStatusItemsResponse = {
        success: true,
        message: "Load more story items successful",
        statusItems: storyItems ? storyItems : [],
        hasMorePages: hasMorePages,
      };
      return response;
    } catch (error) {
      console.error(
        error ? error : "An error occurred when loading more story items"
      );
      throw error;
    }
  }
}

exports.handler = LoadMoreStoryItemsLambda.handler;
