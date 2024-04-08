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
exports.LoadMoreFolloweesLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
class LoadMoreFolloweesLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
            const followService = new FollowService_1.FollowService(factory);
            try {
                // deserialize the event into a LoadMoreFollowItemsRequest
                event = tweeter_shared_1.LoadMoreFollowItemsRequest.fromJSON(event);
                const [followees, hasMorePages] = yield followService.loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem);
                let response = {
                    success: true,
                    message: "Load more followees successful",
                    users: followees.map((user) => user.dto),
                    hasMorePages: hasMorePages,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when loading more followees");
                throw error;
            }
        });
    }
}
exports.LoadMoreFolloweesLambda = LoadMoreFolloweesLambda;
exports.handler = LoadMoreFolloweesLambda.handler;
