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
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    constructor(factory) {
        this.followDAO = factory.getFollowDAO();
    }
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with result of calling to the database
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (!user) {
                throw new Error(`[Bad Request] user login failed for ${alias}`);
            }
            // TODO: have this return a messgae from the DAO as well(incorrect password, user not found, etc.)
            return [user, tweeter_shared_1.FakeData.instance.authToken];
        });
    }
    register(firstName, lastName, alias, password, userImageBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with result of calling to the database
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (!user) {
                throw new Error(`[Bad Request] user registration failed for ${alias}`);
            }
            // TODO: have this return the message from the DAO (duplicate user, etc.)
            return [user, tweeter_shared_1.FakeData.instance.authToken];
        });
    }
    getUser(authTokenDto, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling database
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            if (!authToken) {
                throw new Error("[AuthError] unauthenticated request");
            }
            const user = tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
            if (!user) {
                throw new Error(`[Bad Request] requested user ${alias} does not exist`);
            }
            return user;
        });
    }
    logout(authTokenDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling database
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            if (!authToken) {
                throw new Error("[AuthError] unauthenticated request");
            }
        });
    }
}
exports.UserService = UserService;
