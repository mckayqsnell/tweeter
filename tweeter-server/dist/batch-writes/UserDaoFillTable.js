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
exports.UserDaoFillTable = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const ClientDynamo_1 = require("./ClientDynamo");
const crypto_js_1 = require("crypto-js");
const child_process_1 = require("child_process");
class UserDaoFillTable {
    constructor() {
        this.TABLE_NAME = "users";
        this.PRIMARY_KEY = "alias";
        this.FIRST_NAME = "firstName";
        this.LAST_NAME = "lastName";
        this.PASSWORD = "password";
        this.IMAGE_URL = "imageUrl";
        this.FOLLOWING_COUNT = "followingCount";
        this.FOLLOWERS_COUNT = "followersCount";
    }
    createUsers(userList, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userList.length == 0) {
                console.log("zero followers to batch write");
                return;
            }
            else {
                const hashedPassword = (0, crypto_js_1.SHA256)(password).toString();
                const params = {
                    RequestItems: {
                        [this.TABLE_NAME]: this.createPutUserRequestItems(userList, hashedPassword),
                    },
                };
                yield ClientDynamo_1.ddbDocClient
                    .send(new lib_dynamodb_1.BatchWriteCommand(params))
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    yield this.putUnprocessedItems(resp, params);
                }))
                    .catch((err) => {
                    throw new Error("Error while batchwriting users with params: " +
                        params +
                        ": \n" +
                        err);
                });
            }
        });
    }
    createPutUserRequestItems(userList, hashedPassword) {
        return userList.map((user) => this.createPutUserRequest(user, hashedPassword));
    }
    createPutUserRequest(user, hashedPassword) {
        let item = {
            [this.PRIMARY_KEY]: user.alias,
            [this.FIRST_NAME]: user.firstName,
            [this.LAST_NAME]: user.lastName,
            [this.PASSWORD]: hashedPassword,
            [this.IMAGE_URL]: user.imageUrl,
            [this.FOLLOWERS_COUNT]: 0,
            [this.FOLLOWING_COUNT]: 1,
        };
        let request = {
            PutRequest: {
                Item: item,
            },
        };
        return request;
    }
    putUnprocessedItems(resp, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resp.UnprocessedItems != undefined) {
                let sec = 0.01;
                while (Object.keys(resp.UnprocessedItems).length > 0) {
                    console.log(Object.keys(resp.UnprocessedItems.feed).length + " unprocessed items");
                    //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                    // @ts-ignore
                    params.RequestItems = resp.UnprocessedItems;
                    (0, child_process_1.execSync)("sleep " + sec);
                    if (sec < 1)
                        sec += 0.1;
                    yield ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params));
                    if (resp.UnprocessedItems == undefined) {
                        break;
                    }
                }
            }
        });
    }
    increaseFollowersCount(alias, count) {
        const params = {
            TableName: this.TABLE_NAME,
            Key: { [this.PRIMARY_KEY]: alias },
            ExpressionAttributeValues: { ":inc": count },
            UpdateExpression: "SET " +
                this.FOLLOWERS_COUNT +
                " = " +
                this.FOLLOWERS_COUNT +
                " + :inc",
        };
        ClientDynamo_1.ddbDocClient.send(new lib_dynamodb_1.UpdateCommand(params)).then((data) => {
            return true;
        });
    }
}
exports.UserDaoFillTable = UserDaoFillTable;
