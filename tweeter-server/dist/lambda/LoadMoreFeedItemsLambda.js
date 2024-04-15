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
exports.LoadMoreFeedItemsLambda = void 0;
const Request_1 = require("tweeter-shared/dist/model/net/Request");
const StatusService_1 = require("../model/service/StatusService");
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
const AuthService_1 = require("../model/service/AuthService");
class LoadMoreFeedItemsLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
            const authService = new AuthService_1.AuthService(factory);
            const statusService = new StatusService_1.StatusService(factory, authService);
            try {
                event = Request_1.LoadMoreStatusItemsRequest.fromJSON(event);
                const [feedItems, hasMorePages] = yield statusService.loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem);
                let response = {
                    success: true,
                    message: "Load more feed items successful",
                    statusItems: feedItems.map((feedItem) => feedItem),
                    hasMorePages: hasMorePages,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when loading more feed items");
                throw error;
            }
        });
    }
}
exports.LoadMoreFeedItemsLambda = LoadMoreFeedItemsLambda;
exports.handler = LoadMoreFeedItemsLambda.handler;
