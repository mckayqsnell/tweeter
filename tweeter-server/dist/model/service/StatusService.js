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
exports.StatusService = void 0;
const BaseService_1 = require("./BaseService");
const SQSSender_1 = require("../sqs/SQSSender");
const POSTSTATUSQUEUEURL = "https://sqs.us-west-2.amazonaws.com/108857565390/postStatusQueue";
class StatusService extends BaseService_1.BaseService {
    constructor(factory, authService) {
        super(factory, authService);
        this.sqsClient = new SQSSender_1.SQSSender(POSTSTATUSQUEUEURL);
        this.loadMoreFeedItems = (authTokenDto, userDto, pageSize, lastItem) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokenDto, userDto, pageSize]);
            try {
                // validate the authToken
                const validated = yield this.authService.validateAuthToken(authTokenDto);
                if (!validated) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                const lastItemTimestamp = lastItem ? lastItem.timestamp : undefined; // check if lastItem is present
                const [items, hasMore] = yield this.feedDAO.loadMoreFeedItems(userDto.alias, pageSize, lastItemTimestamp);
                console.log(`items ${items} hasMore: ${hasMore} from loadMoreFeedItems`);
                // convert the items to StatusDtos
                const statusDtos = items.map((feed) => this.feedDBToStatusDto(feed));
                console.log(`StatusDtos ${statusDtos} hasMore: ${hasMore} from loadMoreFeedItems`);
                return [statusDtos, hasMore];
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to load more feed items: ${error}`);
            }
        });
        this.feedDBToStatusDto = (feed) => {
            return {
                timestamp: feed.timestamp,
                post: feed.post,
                user: {
                    alias: feed.sender_alias,
                    firstName: feed.sender_firstName,
                    lastName: feed.sender_lastName,
                    imageUrl: feed.sender_imageUrl,
                },
            };
        };
        this.storyDBToStatusDto = (story) => {
            return {
                timestamp: story.timestamp,
                post: story.post,
                user: {
                    alias: story.sender_alias,
                    firstName: story.sender_firstName,
                    lastName: story.sender_lastName,
                    imageUrl: story.sender_imageUrl,
                },
            };
        };
        this.feedDtoToFeedDB = (statusDto) => {
            return {
                reciever_alias: statusDto.user.alias,
                timestamp: statusDto.timestamp,
                post: statusDto.post,
                sender_firstName: statusDto.user.firstName,
                sender_lastName: statusDto.user.lastName,
                sender_alias: statusDto.user.alias,
                sender_imageUrl: statusDto.user.imageUrl,
            };
        };
        this.storyDtoToStoryDB = (statusDto) => {
            return {
                sender_alias: statusDto.user.alias,
                timestamp: statusDto.timestamp,
                post: statusDto.post,
                sender_firstName: statusDto.user.firstName,
                sender_lastName: statusDto.user.lastName,
                sender_imageUrl: statusDto.user.imageUrl,
            };
        };
        this.feedDAO = factory.getFeedDAO();
        this.storyDAO = factory.getStoryDAO();
    }
    loadMoreStoryItems(authTokeDto, userDto, pageSize, lastItemDto) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokeDto, userDto, pageSize]);
            try {
                // validate the authToken
                const validated = yield this.authService.validateAuthToken(authTokeDto);
                if (!validated) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                const lastItemTimestamp = lastItemDto ? lastItemDto.timestamp : undefined;
                const [items, hasMore] = yield this.storyDAO.loadMoreStoryItems(userDto.alias, pageSize, lastItemTimestamp);
                console.log(`items ${items} hasMore: ${hasMore} from loadMoreStoryItems`);
                // convert the items to StatusDtos
                const statusDtos = items.map((story) => this.storyDBToStatusDto(story));
                console.log(`StatusDtos ${statusDtos} hasMore: ${hasMore} from loadMoreStoryItems`);
                return [statusDtos, hasMore];
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to load more story items: ${error}`);
            }
        });
    }
    postStatus(authTokenDto, newStatusDto) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokenDto, newStatusDto]);
            try {
                // validate the authToken
                const validated = yield this.authService.validateAuthToken(authTokenDto);
                if (!validated) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                // post to the users own story
                const newStatusStoryDB = this.storyDtoToStoryDB(newStatusDto);
                yield this.storyDAO.postStoryItem(newStatusStoryDB);
                // update the feed of everyone who follows that user
                // Milestone 4b
                // construct the message for SQS
                const message = {
                    senderAlias: newStatusDto.user.alias, // alias of the user who posted the status
                    timestamp: newStatusDto.timestamp,
                    post: newStatusDto.post,
                    senderFirstName: newStatusDto.user.firstName,
                    senderLastName: newStatusDto.user.lastName,
                    senderImageUrl: newStatusDto.user.imageUrl,
                };
                yield this.sqsClient.sendMessage(JSON.stringify(message));
                console.log(`message sent to SQS: ${message}`);
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to post status: ${error}`);
            }
        });
    }
}
exports.StatusService = StatusService;
