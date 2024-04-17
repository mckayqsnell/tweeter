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
exports.DynamoFollowDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDAO_1 = require("./DynamoDAO");
class DynamoFollowDAO extends DynamoDAO_1.DynamoDAO {
    constructor() {
        super(...arguments);
        this.getPageOfFollowees = (followerHandle, pageSize, lastFolloweeHandle // last followee handle from the previous page
        ) => __awaiter(this, void 0, void 0, function* () {
            console.log("getPageOfFollowees");
            console.log("followerHandle", followerHandle);
            console.log("pageSize", pageSize);
            console.log("lastFolloweeHandle", lastFolloweeHandle);
            const params = {
                TableName: "follows",
                KeyConditionExpression: "follower_handle = :fh",
                ExpressionAttributeValues: {
                    ":fh": followerHandle,
                },
                Limit: pageSize, // maximum number of items to retrieve
                ExclusiveStartKey: lastFolloweeHandle
                    ? {
                        follower_handle: followerHandle,
                        followee_handle: lastFolloweeHandle,
                    }
                    : undefined,
            };
            try {
                const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
                console.log("data from getPageOfFollowees", data);
                const followDBs = data.Items
                    ? data.Items.map((item) => ({
                        followee_handle: item.followee_handle || "",
                        follower_handle: item.follower_handle || "",
                        followeeFirstName: item.followeeFirstName || "",
                        followeeLastName: item.followeeLastName || "",
                        followeeAlias: item.followeeAlias || "",
                        followeeImageUrl: item.followeeImageUrl || "",
                        followerFirstName: item.followerFirstName || "",
                        followerLastName: item.followerLastName || "",
                        followerAlias: item.followerAlias || "",
                        followerImageUrl: item.followerImageUrl || "",
                    }))
                    : [];
                console.log("followDBs from getPageOfFollowees", followDBs);
                console.log("data.LastEvaluatedKey", data.LastEvaluatedKey);
                console.log(" !!data.LastEvaluatedKey", !!data.LastEvaluatedKey);
                return [followDBs, !!data.LastEvaluatedKey];
            }
            catch (error) {
                console.error(`Error retrieving followees from the database: ${error}`);
                throw new Error(`Error retrieving followees from the database: ${error}`);
            }
        });
        this.getPageOfFollowers = (followeeHandle, pageSize, lastFollowerHandle // last follower handle from the previous page
        ) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "follows",
                IndexName: "follows_index",
                KeyConditionExpression: "followee_handle = :fh",
                ExpressionAttributeValues: {
                    ":fh": followeeHandle,
                },
                Limit: pageSize, // maximum number of items to retrieve
                ExclusiveStartKey: lastFollowerHandle
                    ? {
                        followee_handle: followeeHandle,
                        follower_handle: lastFollowerHandle,
                    }
                    : undefined,
            };
            try {
                const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
                console.log("data from getPageOfFollowers", data);
                const followDBs = data.Items
                    ? data.Items.map((item) => ({
                        followee_handle: item.followee_handle,
                        follower_handle: item.follower_handle,
                        followeeFirstName: item.followeeFirstName,
                        followeeLastName: item.followeeLastName,
                        followeeAlias: item.followeeAlias,
                        followeeImageUrl: item.followeeImageUrl,
                        followerFirstName: item.followerFirstName,
                        followerLastName: item.followerLastName,
                        followerAlias: item.followerAlias,
                        followerImageUrl: item.followerImageUrl,
                    }))
                    : [];
                console.log("followDBs from getPageOfFollowers", followDBs);
                return [followDBs, !!data.LastEvaluatedKey];
            }
            catch (error) {
                console.error(`Error retrieving followers from the database: ${error}`);
                throw new Error(`Error retrieving followers from the database: ${error}`);
            }
        });
        this.follow = (userRequestingToFollow, userToFollow) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "follows",
                Item: {
                    follower_handle: userRequestingToFollow.alias,
                    followee_handle: userToFollow.alias,
                    followeeFirstName: userToFollow.firstName,
                    followeeLastName: userToFollow.lastName,
                    followeeAlias: userToFollow.alias,
                    followeeImageUrl: userToFollow.imageUrl,
                    followerFirstName: userRequestingToFollow.firstName,
                    followerLastName: userRequestingToFollow.lastName,
                    followerAlias: userRequestingToFollow.alias,
                    followerImageUrl: userRequestingToFollow.imageUrl,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.PutCommand(params));
                console.log(`Successfully stored follow between ${userRequestingToFollow.alias} and ${userToFollow.alias} in the database`);
            }
            catch (error) {
                console.error(`Error storing follow between ${userRequestingToFollow.alias} and ${userToFollow.alias} in the database: ${error}`);
                throw new Error(`Error storing follow between ${userRequestingToFollow.alias} and ${userToFollow.alias} in the database: ${error}`);
            }
        });
        this.unfollow = (userRequestingToUnfollow, userToUnfollow) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "follows",
                Key: {
                    follower_handle: userRequestingToUnfollow.alias,
                    followee_handle: userToUnfollow.alias,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
                console.log(`Successfully deleted follow between ${userRequestingToUnfollow.alias} and ${userToUnfollow.alias} in the database`);
            }
            catch (error) {
                console.error(`Error deleting follow between ${userRequestingToUnfollow.alias} and ${userToUnfollow.alias} in the database: ${error}`);
                throw new Error(`Error deleting follow between ${userRequestingToUnfollow.alias} and ${userToUnfollow.alias} in the database: ${error}`);
            }
        });
        this.getIsFollowerStatus = (user, selectedUser) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const params = {
                TableName: "follows",
                KeyConditionExpression: "follower_handle = :fh and followee_handle = :sh",
                ExpressionAttributeValues: {
                    ":fh": selectedUser.alias,
                    ":sh": user.alias,
                },
            };
            try {
                const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
                console.log("data from getIsFollowerStatus", data);
                return ((_b = (_a = data === null || data === void 0 ? void 0 : data.Items) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0;
            }
            catch (error) {
                console.error(`Error getting isFollowerStatus between ${user.alias} and ${selectedUser.alias} in the database: ${error}`);
                throw new Error(`Error getting isFollowerStatus between ${user.alias} and ${selectedUser.alias} in the database: ${error}`);
            }
        });
        this.getAllFollowersOfAUser = (alias) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "follows",
                IndexName: "follows_index",
                KeyConditionExpression: "followee_handle = :fh",
                ExpressionAttributeValues: {
                    ":fh": alias,
                },
            };
            try {
                const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
                console.log("data from getAllFollowersOfAUser", data);
                return data.Items
                    ? data.Items.map((item) => ({
                        alias: item.follower_handle,
                        firstName: item.followerFirstName,
                        lastName: item.followerLastName,
                        imageUrl: item.followerImageUrl,
                    }))
                    : [];
            }
            catch (error) {
                console.error(`Error getting all followers of ${alias} in the database: ${error}`);
                throw new Error(`Error getting all followers of ${alias} in the database: ${error}`);
            }
        });
    }
    static get instance() {
        if (!DynamoFollowDAO._instance) {
            DynamoFollowDAO._instance = new DynamoFollowDAO();
            console.log("DynamoFollowDAO instance created");
        }
        return DynamoFollowDAO._instance;
    }
}
exports.DynamoFollowDAO = DynamoFollowDAO;
