import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LogoutLambda {
    static async handler(event: LogoutRequest): Promise<LogoutResponse> {
        await new UserService().logout(event.authToken);
        
        let response = {
            success: true,
            message: "Logout successful"
        };
        return response;
    }
}

exports.handler = LogoutLambda.handler;