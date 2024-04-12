import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export abstract class DynamoDAO {
  private static _client: DynamoDBDocumentClient;

  protected get client(): DynamoDBDocumentClient {
    if (!DynamoDAO._client) {
      const ddbClient = new DynamoDBClient({});
      DynamoDAO._client = DynamoDBDocumentClient.from(ddbClient);
      console.log("DynamoDB client initialized");
    }
    return DynamoDAO._client;
  }
}
