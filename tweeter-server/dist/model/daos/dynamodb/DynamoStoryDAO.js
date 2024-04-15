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
exports.DynamoStoryDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDAO_1 = require("./DynamoDAO");
class DynamoStoryDAO extends DynamoDAO_1.DynamoDAO {
    constructor() {
        super(...arguments);
        this.loadMoreStoryItems = (alias, pageSize, lastItemTimestamp) => __awaiter(this, void 0, void 0, function* () {
            // partition key: alias (person whos story it is, who posted the status)
            // sort key: timestamp (time the story was posted)
            const params = {
                TableName: "story", // Adjust with your actual table name
                KeyConditionExpression: "sender_alias = :alias",
                ExpressionAttributeValues: {
                    ":alias": alias,
                },
                Limit: pageSize,
                ExclusiveStartKey: lastItemTimestamp
                    ? {
                        sender_alias: alias,
                        timestamp: lastItemTimestamp,
                    }
                    : undefined,
                ScanIndexForward: false, // Retrieve items in descending order by timestamp
            };
            try {
                const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
                const hasMore = !!data.LastEvaluatedKey;
                console.log("data from loadMoreStoryItems", data);
                const storyDBs = data.Items
                    ? data.Items.map((item) => ({
                        sender_alias: item.sender_alias,
                        timestamp: item.timestamp,
                        post: item.post,
                        sender_firstName: item.sender_firstName,
                        sender_lastName: item.sender_lastName,
                        sender_imageUrl: item.sender_imageUrl,
                    }))
                    : [];
                console.log("storyDBs from loadMoreStoryItems", storyDBs);
                return [storyDBs, hasMore];
            }
            catch (error) {
                console.error(`Error retrieving story items from the database: ${error}`);
                throw new Error(`Error retrieving story items from the database: ${error}`);
            }
        });
        this.postStoryItem = (storyDB) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "story",
                Item: {
                    sender_alias: storyDB.sender_alias,
                    timestamp: storyDB.timestamp,
                    post: storyDB.post,
                    sender_firstName: storyDB.sender_firstName,
                    sender_lastName: storyDB.sender_lastName,
                    sender_imageUrl: storyDB.sender_imageUrl,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.PutCommand(params));
                console.log(`Successfully stored story item for ${storyDB.sender_alias} in the database`);
            }
            catch (error) {
                console.error(`Error storing story item for ${storyDB.sender_alias} in the database: ${error}`);
                throw new Error(`Error storing story item for ${storyDB.sender_alias} in the database: ${error}`);
            }
        });
    }
}
exports.DynamoStoryDAO = DynamoStoryDAO;
