import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFolloweesCountLambda {
    static async handler(event: GetFollowCountRequest): Promise<GetFollowCountResponse> {
        const count = await new FollowService().getFolloweesCount(event.authToken, event.user);

        let response = {
            success: true,
            message: "Get followees count successful",
            count: count
        };
        return response;
    }
}

exports.handler = GetFolloweesCountLambda.handler;