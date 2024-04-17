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
exports.AuthService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class AuthService {
    constructor(factory) {
        this.createAuthToken = (alias) => __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.Generate();
            const authTokenDb = this.makeAuthTokenDb(authToken, alias);
            try {
                yield this.AuthTokenDAO.storeToken(authTokenDb);
                return authToken.dto;
            }
            catch (error) {
                throw new Error(`[Internal Server Error] Failed to store AuthToken in the database: ${error}`);
            }
        });
        this.deleteAuthToken = (authToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Deleting token ${authToken.token} in AuthService`);
                yield this.AuthTokenDAO.deleteToken(authToken.token);
            }
            catch (error) {
                throw new Error(`[Internal Server Error] Failed to delete AuthToken in the database: ${error}`);
            }
        });
        this.getAlias = (authToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authTokenfromDb = yield this.AuthTokenDAO.getToken(authToken.token);
                return authTokenfromDb.alias;
            }
            catch (error) {
                throw new Error(`[Internal Server Error] Failed to get alias from the database: ${error}`);
            }
        });
        this.makeAuthTokenDb = (authToken, alias) => {
            return {
                token: authToken.token,
                expiretime: authToken.timestamp + 24 * 60 * 60 * 1000, // convert timestamp to expire time by adding 24 hours
                alias: alias,
            };
        };
        this.AuthTokenDAO = factory.getAuthTokenDAO();
    }
    validateAuthToken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!authToken) {
                console.error(`Token is undefined or null in validateAuthToken in AuthService`);
                return false;
            }
            try {
                const authTokenfromDb = yield this.AuthTokenDAO.getToken(authToken.token);
                console.log(`Validating token ${authTokenfromDb} from the database`);
                if (!authTokenfromDb) {
                    console.log(`Token ${authToken.token} not found in the database`);
                }
                else {
                    console.log(`Token ${authToken.token} found in the database`);
                }
                // check if this authToken is expired
                if (authTokenfromDb.expiretime < Date.now()) {
                    console.log(`Token ${authToken.token} has expired`);
                    // delete the expired token
                    yield this.AuthTokenDAO.deleteToken(authToken.token);
                    return false;
                }
                return authTokenfromDb !== null;
            }
            catch (error) {
                console.error(`Error validating token ${authToken.token} from the database: ${error}`);
                return false;
            }
        });
    }
}
exports.AuthService = AuthService;
