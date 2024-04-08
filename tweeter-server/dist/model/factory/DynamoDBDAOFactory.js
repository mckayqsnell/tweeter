"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBDAOFactory = void 0;
const DynamoAuthTokenDAO_1 = require("../daos/dynamodb/DynamoAuthTokenDAO");
const DynamoFeedDAO_1 = require("../daos/dynamodb/DynamoFeedDAO");
const DynamoFollowDAO_1 = require("../daos/dynamodb/DynamoFollowDAO");
const DynamoStoryDAO_1 = require("../daos/dynamodb/DynamoStoryDAO");
const DynamoUserDAO_1 = require("../daos/dynamodb/DynamoUserDAO");
class DynamoDBDAOFactory {
    constructor() { }
    static getInstance() {
        if (!DynamoDBDAOFactory.instance) {
            DynamoDBDAOFactory.instance = new DynamoDBDAOFactory();
        }
        return DynamoDBDAOFactory.instance;
    }
    getUserDAO() {
        return new DynamoUserDAO_1.DynamoUserDAO();
    }
    getFeedDAO() {
        return new DynamoFeedDAO_1.DynamoFeedDAO();
    }
    getFollowDAO() {
        return new DynamoFollowDAO_1.DynamoFollowDAO();
    }
    getStoryDAO() {
        return new DynamoStoryDAO_1.DynamoStoryDAO();
    }
    getAuthTokenDAO() {
        return new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
    }
}
exports.DynamoDBDAOFactory = DynamoDBDAOFactory;
