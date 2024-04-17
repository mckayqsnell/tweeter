import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
    console.log("feedDBs", feedDBs);
    if (feedDBs.length === 0) {
      console.log("No feed items to post");
      return;
    }

    const params: BatchWriteCommandInput = {
      RequestItems: {
        feed: feedDBs.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    try {
      const resp = await this.client.send(new BatchWriteCommand(params));
      await this.handleUnprocessedItems(resp, params);
    } catch (error) {
      console.error(`Batch write failed: ${error}`);
      throw new Error(`Batch write failed: ${error}`);
    }
  };

  private async handleUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    if (
      resp.UnprocessedItems &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      let delay = 50; // Start with a 50 ms delay
      while (Object.keys(resp.UnprocessedItems).length > 0) {
        console.log(`Delaying for ${delay}ms to retry unprocessed items.`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff

        console.log(
          `Retrying ${
            Object.keys(resp.UnprocessedItems.feed).length
          } unprocessed items.`
        );
        params.RequestItems = resp.UnprocessedItems;
        resp = await this.client.send(new BatchWriteCommand(params));

        if (
          !resp.UnprocessedItems ||
          Object.keys(resp.UnprocessedItems).length === 0
        ) {
          console.log("All items processed successfully.");
          break;
        }
      }
    }
  }
}
