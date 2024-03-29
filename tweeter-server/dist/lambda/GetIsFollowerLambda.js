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
exports.GetIsFollowerLambda = void 0;
const FollowService_1 = require("../model/service/FollowService");
class GetIsFollowerLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isFollower = yield new FollowService_1.FollowService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser);
                let response = {
                    success: true,
                    message: "Get is follower successful",
                    isFollower: isFollower,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when getting is follower status");
                throw error;
            }
        });
    }
}
exports.GetIsFollowerLambda = GetIsFollowerLambda;
exports.handler = GetIsFollowerLambda.handler;
