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
exports.DynamoUserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDAO_1 = require("./DynamoDAO");
class DynamoUserDAO extends DynamoDAO_1.DynamoDAO {
    constructor() {
        super(...arguments);
        this.register = (firstName, lastName, alias, password, imageUrl) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "users",
                Item: {
                    alias: alias,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    imageUrl: imageUrl,
                    followersCount: 0, // Initialize followers count
                    followeesCount: 0, // Initialize followees count
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.PutCommand(params));
                console.log(`Successfully registered user ${alias} in the database`);
            }
            catch (error) {
                console.error(`Error registering user ${alias} in the database: ${error}`);
                throw new Error(`Error registering user ${alias} in the database: ${error}`);
            }
        });
        this.login = (alias, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "users",
                Key: {
                    alias: alias,
                },
            };
            try {
                const response = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
                console.log(`Successfully retrieved user ${alias} from the database`);
                return response.Item;
            }
            catch (error) {
                console.error(`Error retrieving user ${alias} from the database: ${error}`);
                throw new Error(`Error retrieving user ${alias} from the database: ${error}`);
            }
        });
        this.getUser = (alias) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "users",
                Key: {
                    alias: alias,
                },
            };
            try {
                const response = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
                console.log(`Successfully retrieved user ${alias} from the database`);
                return response.Item;
            }
            catch (error) {
                console.error(`Error retrieving user ${alias} from the database: ${error}`);
                throw new Error(`Error retrieving user ${alias} from the database: ${error}`);
            }
        });
        this.incrementFolloweesCount = (alias) => __awaiter(this, void 0, void 0, function* () {
            yield this.incrementFollowCounts(alias, "SET followeesCount = if_not_exists(followeesCount, :start) + :inc", "followees");
        });
        this.incrementFollowersCount = (alias) => __awaiter(this, void 0, void 0, function* () {
            yield this.incrementFollowCounts(alias, "SET followersCount = if_not_exists(followersCount, :start) + :inc", "followers");
        });
        this.incrementFollowCounts = (alias, updateExpression, operation) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "users",
                Key: { alias },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: {
                    ":inc": 1,
                    ":start": 0,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
                console.log(`Incremented ${operation} count for user ${alias}`);
            }
            catch (error) {
                console.error(`Error incrementing ${operation} count for user ${alias}: ${error}`);
                throw new Error(`Error incrementing ${operation} count for user ${alias}: ${error}`);
            }
        });
        this.decrementFollowersCount = (alias) => __awaiter(this, void 0, void 0, function* () {
            yield this.decrementFollowCounts(alias, "followers");
        });
        this.decrementFolloweesCount = (alias) => __awaiter(this, void 0, void 0, function* () {
            yield this.decrementFollowCounts(alias, "followees");
        });
        this.decrementFollowCounts = (alias, operation) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "users",
                Key: { alias },
                UpdateExpression: `SET ${operation}Count = if_not_exists(${operation}Count, :zero) - :dec`,
                ConditionExpression: `${operation}Count > :zero`,
                ExpressionAttributeValues: {
                    ":dec": 1,
                    ":zero": 0,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
                console.log(`Decremented ${operation} count for user ${alias}`);
            }
            catch (error) {
                console.error(`Error decrementing ${operation} count for user ${alias}: ${error}`);
                throw new Error(`Error decrementing ${operation} count for user ${alias}: ${error}`);
            }
        });
    }
}
exports.DynamoUserDAO = DynamoUserDAO;
