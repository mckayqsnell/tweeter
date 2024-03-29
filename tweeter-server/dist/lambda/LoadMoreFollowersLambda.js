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
exports.LoadMoreFollowersLambda = void 0;
const Request_1 = require("tweeter-shared/dist/model/net/Request");
const FollowService_1 = require("../model/service/FollowService");
class LoadMoreFollowersLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event = Request_1.LoadMoreFollowItemsRequest.fromJSON(event);
            const [followers, hasMore] = yield new FollowService_1.FollowService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem);
            let response = {
                success: true,
                message: "Successfully loaded more followers.",
                users: followers.map((user) => user.dto),
                hasMorePages: hasMore
            };
            return response;
        });
    }
}
exports.LoadMoreFollowersLambda = LoadMoreFollowersLambda;
exports.handler = LoadMoreFollowersLambda.handler;
