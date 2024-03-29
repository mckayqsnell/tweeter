import { LoadMoreFollowItemsRequest } from "tweeter-shared/dist/model/net/Request";
import { LoadMoreFollowItemsResponse } from "tweeter-shared/dist/model/net/Response";
import { FollowService } from "../model/service/FollowService";

export class LoadMoreFollowersLambda {
    static async handler(event: any): Promise<LoadMoreFollowItemsResponse> {
        event = LoadMoreFollowItemsRequest.fromJSON(event);
        
        const [followers, hasMore] = await new FollowService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem);
        
        let response = {
            success: true,
            message: "Successfully loaded more followers.",
            users: followers.map((user) => user.dto),
            hasMorePages: hasMore
        };
        return response;
    }
}

exports.handler = LoadMoreFollowersLambda.handler;