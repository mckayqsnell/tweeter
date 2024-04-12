"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBDAOFactory = void 0;
const DynamoAuthTokenDAO_1 = require("../daos/dynamodb/DynamoAuthTokenDAO");
const DynamoFeedDAO_1 = require("../daos/dynamodb/DynamoFeedDAO");
const DynamoFollowDAO_1 = require("../daos/dynamodb/DynamoFollowDAO");
const DynamoStoryDAO_1 = require("../daos/dynamodb/DynamoStoryDAO");
const DynamoUserDAO_1 = require("../daos/dynamodb/DynamoUserDAO");
const S3StorageDAO_1 = require("../daos/dynamodb/S3StorageDAO");
class DynamoDBDAOFactory {
    constructor() {
        this.userDAO = new DynamoUserDAO_1.DynamoUserDAO();
        this.feedDAO = new DynamoFeedDAO_1.DynamoFeedDAO();
        this.followDAO = new DynamoFollowDAO_1.DynamoFollowDAO();
        this.storyDAO = new DynamoStoryDAO_1.DynamoStoryDAO();
        this.authTokenDAO = new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
        this.s3StorageDAO = new S3StorageDAO_1.S3StorageDAO();
    }
    static getInstance() {
        if (!DynamoDBDAOFactory.instance) {
            DynamoDBDAOFactory.instance = new DynamoDBDAOFactory();
        }
        return DynamoDBDAOFactory.instance;
    }
    getUserDAO() {
        return this.userDAO;
    }
    getFeedDAO() {
        return this.feedDAO;
    }
    getFollowDAO() {
        return this.followDAO;
    }
    getStoryDAO() {
        return this.storyDAO;
    }
    getAuthTokenDAO() {
        return this.authTokenDAO;
    }
    getS3StorageDAO() {
        return this.s3StorageDAO;
    }
}
exports.DynamoDBDAOFactory = DynamoDBDAOFactory;
