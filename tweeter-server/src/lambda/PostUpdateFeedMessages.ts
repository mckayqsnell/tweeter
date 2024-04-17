import { SQSEvent } from "aws-lambda";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { SQSSender } from "../model/sqs/SQSSender";

const FOLLOWER_PAGE_SIZE = 25;
const UPDATE_FEED_QUEUE_URL =
  "https://sqs.us-west-2.amazonaws.com/108857565390/UpdateFeedQueue";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  const factory = DynamoDBDAOFactory.getInstance();
  const followDAO = factory.getFollowDAO();
  const sqsSender = new SQSSender(UPDATE_FEED_QUEUE_URL);

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);

    let lastFollowerHandle = undefined; // Initially, there is no last handle
    let hasMore = true;

    while (hasMore) {
      try {
        const [followers, more] = await followDAO.getPageOfFollowers(
          messageBody.senderAlias,
          FOLLOWER_PAGE_SIZE,
          lastFollowerHandle
        );
        hasMore = more;

        console.log(`followers: ${followers}`)
        console.log(`more: ${more}`)

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
          await sqsSender.sendMessage(JSON.stringify(feedUpdates));

          // Update the lastFollowerHandle to the last item in the batch
          lastFollowerHandle = followers[followers.length - 1].follower_handle;
        } else {
          hasMore = false; // Stop if there are no followers
        }
      } catch (error) {
        console.error(
          `Error processing followers for ${messageBody.senderAlias}: ${error}`
        );
        throw new Error(`Error in PostUpdateFeedMessages: ${error}`);
      }
    }
  }
};
