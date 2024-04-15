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
            const params = {
                RequestItems: {
                    "feed": feedDBs.map((item) => ({
                        PutRequest: {
                            Item: item,
                        },
                    })),
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
            }
            catch (error) {
                console.error(`Batch write failed: ${error}`);
                throw new Error(`Batch write failed: ${error}`);
            }
        });
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
