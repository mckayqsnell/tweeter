import { BatchWriteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FeedDB } from "../../DatabaseTypes";
import { IFeedDAO } from "../interfaces/IFeedDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFeedDAO extends DynamoDAO implements IFeedDAO {
  public loadMoreFeedItems = async (
    alias: string,
    pageSize: number,
    lastItemTimestamp: number | undefined
  ): Promise<[FeedDB[], boolean]> => {
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
      const data = await this.client.send(new QueryCommand(params));
      const hasMore = !!data.LastEvaluatedKey;
      console.log("data from loadMoreFeedItems", data);

      return [data.Items ? (data.Items as FeedDB[]) : [], hasMore];
    } catch (error) {
      console.error(`Error retrieving feed items from the database: ${error}`);
      throw new Error(
        `Error retrieving feed items from the database: ${error}`
      );
    }
  };

  public postFeedItems = async (feedDBs: FeedDB[]): Promise<void> => {
    console.log("feedDBs", feedDBs)
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
      await this.client.send(new BatchWriteCommand(params));
    } catch (error) {
      console.error(`Batch write failed: ${error}`);
      throw new Error(`Batch write failed: ${error}`);
    }
  };
}
