import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFollowersCountLambda {
    static async handler(event: GetFollowCountRequest): Promise<GetFollowCountResponse> {
        const count = await new FollowService().getFollowersCount(event.authToken, event.user);

        let response = {
            success: true,
            message: "Get followers count successful",
            count: count
        };
        return response;
    }
}

exports.handler = GetFollowersCountLambda.handler;