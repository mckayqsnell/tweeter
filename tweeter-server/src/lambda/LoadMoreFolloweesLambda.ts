import { LoadMoreFollowItemsRequest, LoadMoreFollowItemsResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class LoadMoreFolloweesLambda {
    static async handler(event: any): Promise<LoadMoreFollowItemsResponse> {
        console.log("LoadMoreFolloweesLambda.handler: event = ", event);
        // deserialize the event into a LoadMoreFollowItemsRequest
        event = LoadMoreFollowItemsRequest.fromJSON(event);

        console.log("LoadMoreFolloweesRequest deserialized")
        console.log("LoadMoreFolloweesLambda.handler: event = ", event);

        if (!event.authToken || !event.user) {
            return {
                success: false,
                message: "Request is missing required fields",
                users: [],
                hasMorePages: false
            };
        }
      
      const [followees, hasMorePages] = await new FollowService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem);
        
        let response = {
          success: true,
          message: "Load more followees successful",
          users: followees.map((user) => user.dto),
          hasMorePages: hasMorePages,
        };

        return response;
    }
}

exports.handler = LoadMoreFolloweesLambda.handler;