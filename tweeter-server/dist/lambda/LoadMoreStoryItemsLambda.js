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
exports.LoadMoreStoryItemsLambda = void 0;
const StatusService_1 = require("../model/service/StatusService");
class LoadMoreStoryItemsLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const [storyItems, hasMorePages] = yield new StatusService_1.StatusService().loadMoreStoryItems(event.authToken, event.user, event.pageSize, event.lastItem);
            let response = {
                success: true,
                message: "Load more story items successful",
                statusItems: storyItems.map(storyItem => storyItem.dto),
                hasMorePages: hasMorePages
            };
            return response;
        });
    }
}
exports.LoadMoreStoryItemsLambda = LoadMoreStoryItemsLambda;
exports.handler = LoadMoreStoryItemsLambda.handler;
