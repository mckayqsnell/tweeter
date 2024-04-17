import { SQSEvent } from "aws-lambda";
import { DynamoDBDAOFactory } from "../model/factory/DynamoDBDAOFactory";
import { FeedDB } from "../model/DatabaseTypes";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  const factory = DynamoDBDAOFactory.getInstance();
  const feedDAO = factory.getFeedDAO();

  for (const record of event.Records) {
    console.log("Processing record", JSON.stringify(record, null, 2));
    const feedUpdates: FeedDB[] = JSON.parse(record.body);
    console.log("feedUpdates:", feedUpdates);

    try {
      await feedDAO.postFeedItems(feedUpdates);
      console.log(`Successfully posted feed items for ${feedUpdates.length} users.`);
    } catch (error) {
      console.error(`Error posting feed items: ${error}`);
      throw new Error(`Error posting feed items: ${error}`);
    }
  }
}
