"use strict"; // TODO: MIGHT NEED TO REMOVE THIS
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
exports.LoginLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
class LoginLambda {
    constructor() {
        this.handler = (event) => __awaiter(this, void 0, void 0, function* () {
            let response = new tweeter_shared_1.AuthenticateResponse(...(yield new UserService_1.UserService().login(event.username, event.password)));
            return response;
        });
    }
}
exports.LoginLambda = LoginLambda;
