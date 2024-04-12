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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const BaseService_1 = require("./BaseService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService extends BaseService_1.BaseService {
    constructor(factory, authService) {
        super(factory, authService);
        this.login = (alias, password) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([alias, password]);
            try {
                const userdb = yield this.userDAO.login(alias, password);
                if (!userdb) {
                    throw new Error(`[Bad Request] requested user ${alias} does not exist`);
                }
                //verify password
                const isMatch = yield bcryptjs_1.default.compare(password, userdb.password);
                if (!isMatch) {
                    throw new Error(`[AuthError] incorrect password`);
                }
                // Construct a userDTO
                const userDto = {
                    firstName: userdb.firstName,
                    lastName: userdb.lastName,
                    alias: userdb.alias,
                    imageUrl: userdb.imageUrl,
                };
                // store the AuthToken in the database
                const authTokenDto = yield this.authService.createAuthToken(alias);
                return [userDto, authTokenDto];
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to login user ${alias}: ${error}`);
            }
        });
        this.register = (firstName, lastName, alias, password, userImageBase64) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([firstName, lastName, alias, password, userImageBase64]);
            // Send the userImageBase64 to the S3StorageDAO to store the image and get the URL
            try {
                // Store the image in S3 and get the URL
                const imageUrl = yield this.s3StorageDAO.putImage(`${alias}profileImage`, userImageBase64);
                // Hash the password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                yield this.userDAO.register(firstName, lastName, alias, hashedPassword, imageUrl);
                // Construct a userDTO
                const userDto = {
                    firstName: firstName,
                    lastName: lastName,
                    alias: alias,
                    imageUrl: imageUrl,
                };
                // store the AuthToken in the database
                const authTokenDto = yield this.authService.createAuthToken(alias);
                return [userDto, authTokenDto];
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to register user ${alias}: ${error}`);
            }
        });
        this.getUser = (authTokenDto, alias) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokenDto, alias]);
            try {
                const success = yield this.authService.validateAuthToken(authTokenDto);
                if (!success) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                const userdb = yield this.userDAO.getUser(alias);
                if (!userdb) {
                    throw new Error(`[Bad Request] requested user ${alias} does not exist`);
                }
                const userDto = this.makeUserDto(userdb);
                return userDto;
            }
            catch (error) {
                throw new Error(`[AuthError] ${error}`);
            }
        });
        this.logout = (authTokenDto) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokenDto]);
            try {
                yield this.authService.deleteAuthToken(authTokenDto);
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to logout user: ${error}`);
            }
        });
        this.userDAO = factory.getUserDAO();
        this.s3StorageDAO = factory.getS3StorageDAO();
    }
}
exports.UserService = UserService;
