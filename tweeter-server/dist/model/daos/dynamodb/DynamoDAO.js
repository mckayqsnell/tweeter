"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoDAO {
    get client() {
        if (!DynamoDAO._client) {
            const ddbClient = new client_dynamodb_1.DynamoDBClient({});
            DynamoDAO._client = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
            console.log("DynamoDB client initialized");
        }
        return DynamoDAO._client;
    }
}
exports.DynamoDAO = DynamoDAO;
