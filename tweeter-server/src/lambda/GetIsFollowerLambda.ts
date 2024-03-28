import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetIsFollowerLambda {
    static async handler(event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
        const isFollower = await new FollowService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser);
        
        let response = {
            success: true,
            message: "Get is follower successful",
            isFollower: isFollower
        };
        return response;
    }
}

exports.handler = GetIsFollowerLambda.handler;