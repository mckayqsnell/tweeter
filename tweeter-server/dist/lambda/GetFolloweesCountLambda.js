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
exports.GetFolloweesCountLambda = void 0;
const FollowService_1 = require("../model/service/FollowService");
class GetFolloweesCountLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield new FollowService_1.FollowService().getFolloweesCount(event.authToken, event.user);
                let response = {
                    success: true,
                    message: "Get followees count successful",
                    count: count,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when getting followees count");
                throw error;
            }
        });
    }
}
exports.GetFolloweesCountLambda = GetFolloweesCountLambda;
exports.handler = GetFolloweesCountLambda.handler;
