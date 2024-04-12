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
exports.GetUserLambda = void 0;
const Request_1 = require("tweeter-shared/dist/model/net/Request");
const UserService_1 = require("../model/service/UserService");
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
const AuthService_1 = require("../model/service/AuthService");
class GetUserLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
            const authService = new AuthService_1.AuthService(factory);
            const userService = new UserService_1.UserService(factory, authService);
            try {
                const request = Request_1.GetUserRequest.fromJSON(event);
                const user = yield userService.getUser(request.authToken, request.alias);
                let response = {
                    success: true,
                    message: "Get user successful",
                    user: user ? user : null,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when getting a user");
                throw error;
            }
        });
    }
}
exports.GetUserLambda = GetUserLambda;
exports.handler = GetUserLambda.handler;
