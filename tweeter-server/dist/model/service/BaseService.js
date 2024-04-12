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
exports.BaseService = void 0;
class BaseService {
    constructor(daoFactory, authService) {
        this.makeUserDto = (userDb) => {
            return {
                firstName: userDb.firstName,
                lastName: userDb.lastName,
                alias: userDb.alias,
                imageUrl: userDb.imageUrl,
            };
        };
        this.makeAuthTokenDto = (authTokenDb) => {
            return {
                token: authTokenDb.token,
                timestamp: authTokenDb.expiretime - 24 * 60 * 60 * 1000, // convert expire time to timestamp (creation) by subtracting 24 hours
            };
        };
        this.validateAuthToken = (authTokenDto) => __awaiter(this, void 0, void 0, function* () {
            console.log("[BaseService] validateAuthToken");
            if (!authTokenDto) {
                throw new Error("[AuthError] Token is undefined or null in validateAuthToken in BaseService");
            }
            try {
                const validate = yield this.authService.validateAuthToken(authTokenDto);
                if (!validate) {
                    throw new Error("[AuthError] Invalid auth token");
                }
            }
            catch (error) {
                throw new Error("[AuthError] error validating auth token");
            }
        });
        this.validateRequiredFields = (fields) => {
            for (const field of fields) {
                if (!field) {
                    throw new Error("[Bad Request] missing required fields");
                }
            }
        };
        this._daoFactory = daoFactory;
        this._authService = authService;
    }
    get daoFactory() {
        return this._daoFactory;
    }
    get authService() {
        return this._authService;
    }
}
exports.BaseService = BaseService;
