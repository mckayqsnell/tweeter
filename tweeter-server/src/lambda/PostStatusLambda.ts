import { PostStatusRequest } from "tweeter-shared/dist/model/net/Request";
import { PostStatusResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";

export class PostStatusLambda {
    static async handler(event: PostStatusRequest): Promise<PostStatusResponse> {
        await new StatusService().postStatus(event.authToken, event.newStatus);
        let response: PostStatusResponse = {
            success: true,
            message: "Post status successful"
        };
        return response;
    }
}

exports.handler = PostStatusLambda.handler;