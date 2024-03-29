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
exports.RegisterLambda = void 0;
const UserService_1 = require("../model/service/UserService");
class RegisterLambda {
    static handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user, token] = yield new UserService_1.UserService().register(event.firstName, event.lastName, event.alias, event.password, event.imageStringBase64);
                let response = {
                    success: true,
                    message: "Login successful",
                    user: user ? user.dto : null,
                    token: token ? token.dto : null,
                };
                return response;
            }
            catch (error) {
                console.error(error ? error : "An error occurred when registering a user");
                throw error;
            }
        });
    }
}
exports.RegisterLambda = RegisterLambda;
exports.handler = RegisterLambda.handler;
