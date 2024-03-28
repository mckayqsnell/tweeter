import { LoadMoreFollowItemsRequest, LoadMoreFollowItemsResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class LoadMoreFolloweesLambda {
    static async handler(event: LoadMoreFollowItemsRequest): Promise<LoadMoreFollowItemsResponse> {
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