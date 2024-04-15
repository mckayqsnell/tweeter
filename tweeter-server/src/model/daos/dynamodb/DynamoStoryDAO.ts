import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StoryDB } from "../../DatabaseTypes";
import { IStoryDAO } from "../interfaces/IStoryDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoStoryDAO extends DynamoDAO implements IStoryDAO {
  public loadMoreStoryItems = async (
    alias: string,
    pageSize: number,
    lastItemTimestamp: number | undefined
  ): Promise<[StoryDB[], boolean]> => {
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
      const data = await this.client.send(new QueryCommand(params));
      const hasMore = !!data.LastEvaluatedKey;
      console.log("data from loadMoreStoryItems", data);

      const storyDBs = data.Items
        ? data.Items.map((item: any) => ({
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
    } catch (error) {
      console.error(`Error retrieving story items from the database: ${error}`);
      throw new Error(
        `Error retrieving story items from the database: ${error}`
      );
    }
  };

  public postStoryItem = async (storyDB: StoryDB): Promise<void> => {
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
        await this.client.send(new PutCommand(params));
        console.log(`Successfully stored story item for ${storyDB.sender_alias} in the database`);
    } catch (error) {
        console.error(`Error storing story item for ${storyDB.sender_alias} in the database: ${error}`);
        throw new Error(`Error storing story item for ${storyDB.sender_alias} in the database: ${error}`);
    }
  };
}
