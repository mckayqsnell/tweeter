import { User, AuthToken } from "tweeter-shared";
import { IUserDAO } from "../interfaces/IUserDAO";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDB } from "../../DatabaseTypes";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoUserDAO extends DynamoDAO implements IUserDAO {
  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<void> => {
    const params = {
      TableName: "users",
      Item: {
        alias: alias,
        firstName: firstName,
        lastName: lastName,
        password: password,
        imageUrl: imageUrl,
        followersCount: 0, // Initialize followers count
        followeesCount: 0, // Initialize followees count
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Successfully registered user ${alias} in the database`);
    } catch (error) {
      console.error(
        `Error registering user ${alias} in the database: ${error}`
      );
      throw new Error(
        `Error registering user ${alias} in the database: ${error}`
      );
    }
  };

  public login = async (alias: string, password: string): Promise<UserDB> => {
    const params = {
      TableName: "users",
      Key: {
        alias: alias,
      },
    };

    try {
      const response = await this.client.send(new GetCommand(params));
      console.log(`Successfully retrieved user ${alias} from the database`);
      return response.Item as UserDB;
    } catch (error) {
      console.error(
        `Error retrieving user ${alias} from the database: ${error}`
      );
      throw new Error(
        `Error retrieving user ${alias} from the database: ${error}`
      );
    }
  };

  public getUser = async (alias: string): Promise<UserDB> => {
    const params = {
      TableName: "users",
      Key: {
        alias: alias,
      },
    };

    try {
      const response = await this.client.send(new GetCommand(params));
      console.log(`Successfully retrieved user ${alias} from the database`);
      return response.Item as UserDB;
    } catch (error) {
      console.error(
        `Error retrieving user ${alias} from the database: ${error}`
      );
      throw new Error(
        `Error retrieving user ${alias} from the database: ${error}`
      );
    }
  };

  public incrementFolloweesCount = async (alias: string): Promise<void> => {
    await this.incrementFollowCounts(
      alias,
      "SET followeesCount = if_not_exists(followeesCount, :start) + :inc",
      "followees"
    );
  };

  public incrementFollowersCount = async (alias: string): Promise<void> => {
    await this.incrementFollowCounts(
      alias,
      "SET followersCount = if_not_exists(followersCount, :start) + :inc",
      "followers"
    );
  };

  private incrementFollowCounts = async (
    alias: string,
    updateExpression: string,
    operation: string
  ): Promise<void> => {
    const params = {
      TableName: "users",
      Key: { alias },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: {
        ":inc": 1,
        ":start": 0,
      },
    };

    try {
      await this.client.send(new UpdateCommand(params));
      console.log(`Incremented ${operation} count for user ${alias}`);
    } catch (error) {
      console.error(
        `Error incrementing ${operation} count for user ${alias}: ${error}`
      );
      throw new Error(
        `Error incrementing ${operation} count for user ${alias}: ${error}`
      );
    }
  };

  public decrementFollowersCount = async (alias: string): Promise<void> => {
    await this.decrementFollowCounts(alias, "followers");
  };

  public decrementFolloweesCount = async (alias: string): Promise<void> => {
    await this.decrementFollowCounts(alias, "followees");
  };

  private decrementFollowCounts = async (
    alias: string,
    operation: string
  ): Promise<void> => {
    const params = {
      TableName: "users",
      Key: { alias },
      UpdateExpression: `SET ${operation}Count = if_not_exists(${operation}Count, :zero) - :dec`,
      ConditionExpression: `${operation}Count > :zero`,
      ExpressionAttributeValues: {
        ":dec": 1,
        ":zero": 0,
      },
    };

    try {
      await this.client.send(new UpdateCommand(params));
      console.log(`Decremented ${operation} count for user ${alias}`);
    } catch (error) {
      console.error(
        `Error decrementing ${operation} count for user ${alias}: ${error}`
      );
      throw new Error(
        `Error decrementing ${operation} count for user ${alias}: ${error}`
      );
    }
  };
}
