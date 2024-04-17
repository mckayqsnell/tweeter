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
exports.handler = void 0;
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
const SQSSender_1 = require("../model/sqs/SQSSender");
const FOLLOWER_PAGE_SIZE = 25;
const UPDATE_FEED_QUEUE_URL = "https://sqs.us-west-2.amazonaws.com/108857565390/UpdateFeedQueue";
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
    const followDAO = factory.getFollowDAO();
    const sqsSender = new SQSSender_1.SQSSender(UPDATE_FEED_QUEUE_URL);
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        let lastFollowerHandle = undefined; // Initially, there is no last handle
        let hasMore = true;
        while (hasMore) {
            try {
                const [followers, more] = yield followDAO.getPageOfFollowers(messageBody.senderAlias, FOLLOWER_PAGE_SIZE, lastFollowerHandle);
                hasMore = more;
                console.log(`followers: ${followers}`);
                console.log(`more: ${more}`);
                if (followers.length > 0) {
                    const feedUpdates = followers.map((follower) => ({
                        reciever_alias: follower.follower_handle,
                        timestamp: messageBody.timestamp,
                        post: messageBody.post,
                        sender_alias: messageBody.senderAlias,
                        sender_firstName: messageBody.senderFirstName,
                        sender_lastName: messageBody.senderLastName,
                        sender_imageUrl: messageBody.senderImageUrl,
                    }));
                    console.log(`feedUpdates: ${feedUpdates}`);
                    // Send batch update to SQS
                    yield sqsSender.sendMessage(JSON.stringify(feedUpdates));
                    // Update the lastFollowerHandle to the last item in the batch
                    lastFollowerHandle = followers[followers.length - 1].follower_handle;
                }
                else {
                    hasMore = false; // Stop if there are no followers
                }
            }
            catch (error) {
                console.error(`Error processing followers for ${messageBody.senderAlias}: ${error}`);
                throw new Error(`Error in PostUpdateFeedMessages: ${error}`);
            }
        }
    }
});
exports.handler = handler;
