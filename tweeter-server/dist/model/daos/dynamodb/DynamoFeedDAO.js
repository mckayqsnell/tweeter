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
exports.DynamoFeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoDAO_1 = require("./DynamoDAO");
class DynamoFeedDAO extends DynamoDAO_1.DynamoDAO {
    constructor() {
        super(...arguments);
        this.loadMoreFeedItems = (alias, pageSize, lastItemTimestamp) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "feed",
                KeyConditionExpression: "reciever_alias = :alias",
                ExpressionAttributeValues: {
                    ":alias": alias,
                },
                Limit: pageSize,
                ExclusiveStartKey: lastItemTimestamp
                    ? {
                        reciever_alias: alias,
                        timestamp: lastItemTimestamp,
                    }
                    : undefined,
                ScanIndexForward: false,
            };
            try {
                const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
                const hasMore = !!data.LastEvaluatedKey;
                console.log("data from loadMoreFeedItems", data);
                return [data.Items ? data.Items : [], hasMore];
            }
            catch (error) {
                console.error(`Error retrieving feed items from the database: ${error}`);
                throw new Error(`Error retrieving feed items from the database: ${error}`);
            }
        });
        this.postFeedItems = (feedDBs) => __awaiter(this, void 0, void 0, function* () {
            console.log("feedDBs", feedDBs);
            if (feedDBs.length === 0) {
                console.log("No feed items to post");
                return;
            }
            const params = {
                RequestItems: {
                    feed: feedDBs.map((item) => ({
                        PutRequest: {
                            Item: item,
                        },
                    })),
                },
            };
            try {
                const resp = yield this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
                yield this.handleUnprocessedItems(resp, params);
            }
            catch (error) {
                console.error(`Batch write failed: ${error}`);
                throw new Error(`Batch write failed: ${error}`);
            }
        });
    }
    handleUnprocessedItems(resp, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resp.UnprocessedItems &&
                Object.keys(resp.UnprocessedItems).length > 0) {
                let delay = 50; // Start with a 50 ms delay
                while (Object.keys(resp.UnprocessedItems).length > 0) {
                    console.log(`Delaying for ${delay}ms to retry unprocessed items.`);
                    yield new Promise((resolve) => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                    console.log(`Retrying ${Object.keys(resp.UnprocessedItems.feed).length} unprocessed items.`);
                    params.RequestItems = resp.UnprocessedItems;
                    resp = yield this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
                    if (!resp.UnprocessedItems ||
                        Object.keys(resp.UnprocessedItems).length === 0) {
                        console.log("All items processed successfully.");
                        break;
                    }
                }
            }
        });
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
