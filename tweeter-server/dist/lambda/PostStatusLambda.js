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
exports.PostStatusLambda = void 0;
const Request_1 = require("tweeter-shared/dist/model/net/Request");
const StatusService_1 = require("../model/service/StatusService");
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
class PostStatusLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
            const statusService = new StatusService_1.StatusService(factory);
            try {
                event = Request_1.PostStatusRequest.fromJSON(event);
                yield statusService.postStatus(event.authToken, event.newStatus);
                let response = {
                    success: true,
                    message: "Post status successful",
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when posting a status");
                throw error;
            }
        });
    }
}
exports.PostStatusLambda = PostStatusLambda;
exports.handler = PostStatusLambda.handler;
