"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowersCountLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
const AuthService_1 = require("../model/service/AuthService");
class GetFollowersCountLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
            const authService = new AuthService_1.AuthService(factory);
            const followService = new FollowService_1.FollowService(factory, authService);
            console.log("GetFollowersCountLambda event: ", event);
            try {
                const request = tweeter_shared_1.GetFollowCountRequest.fromJSON(event);
                const count = yield followService.getFollowersCount(request.authToken, request.user);
                let response = {
                    success: true,
                    message: "Get followers count successful",
                    count: count,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when getting followers count");
                throw error;
            }
        });
    }
}
exports.GetFollowersCountLambda = GetFollowersCountLambda;
exports.handler = GetFollowersCountLambda.handler;
