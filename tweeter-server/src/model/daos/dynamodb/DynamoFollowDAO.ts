import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { IFollowDAO } from "../interfaces/IFollowDAO";
import { DynamoDAO } from "./DynamoDAO";
import { FollowDB, UserDB } from "../../DatabaseTypes";

export class DynamoFollowDAO extends DynamoDAO implements IFollowDAO {
  private static _instance: DynamoFollowDAO;

  public static get instance(): DynamoFollowDAO {
    if (!DynamoFollowDAO._instance) {
      DynamoFollowDAO._instance = new DynamoFollowDAO();
      console.log("DynamoFollowDAO instance created");
    }
    return DynamoFollowDAO._instance;
  }

  public getPageOfFollowees = async (
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle?: string // last followee handle from the previous page
  ): Promise<[FollowDB[], boolean]> => {
    console.log("getPageOfFollowees");
    console.log("followerHandle", followerHandle);
    console.log("pageSize", pageSize);
    console.log("lastFolloweeHandle", lastFolloweeHandle);

    const params = {
      TableName: "follows",
      KeyConditionExpression: "follower_handle = :fh",
      ExpressionAttributeValues: {
        ":fh": followerHandle,
      },
      Limit: pageSize, // maximum number of items to retrieve
      ExclusiveStartKey: lastFolloweeHandle
        ? {
            follower_handle: followerHandle,
            followee_handle: lastFolloweeHandle,
          }
        : undefined,
    };

    const data = await this.client.send(new QueryCommand(params));
    console.log("data from getPageOfFollowees", data);

    const followDBs = data.Items
      ? data.Items.map((item: any) => ({
          followee_handle: item.followee_handle,
          follower_handle: item.follower_handle,
          followeeFirstName: item.followeeFirstName,
          followeeLastName: item.followeeLastName,
          followeeAlias: item.followeeAlias,
          followeeImageUrl: item.followeeImageUrl,
          followerFirstName: item.followerFirstName,
          followerLastName: item.followerLastName,
          followerAlias: item.followerAlias,
          followerImageUrl: item.followerImageUrl,
        }))
      : [];
    console.log("followDBs from getPageOfFollowees", followDBs);
    return [followDBs, !!data.LastEvaluatedKey];
  };

  public getPageOfFollowers = async (
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle?: string // last follower handle from the previous page
  ): Promise<[FollowDB[], boolean]> => {
    console.log("getPageOfFollowees");
    console.log("followerHandle", followeeHandle);
    console.log("pageSize", pageSize);
    console.log("lastFolloweeHandle", lastFollowerHandle);

    const params = {
      TableName: "follows",
      IndexName: "follows_index",
      KeyConditionExpression: "followee_handle = :fh",
      ExpressionAttributeValues: {
        ":fh": followeeHandle,
      },
      Limit: pageSize, // maximum number of items to retrieve
      ExclusiveStartKey: lastFollowerHandle
        ? {
            followee_handle: followeeHandle,
            follower_handle: lastFollowerHandle,
          }
        : undefined,
    };

    const data = await this.client.send(new QueryCommand(params));
    console.log("data from getPageOfFollowers", data);
    const followDBs = data.Items
      ? data.Items.map((item: any) => ({
          followee_handle: item.followee_handle,
          follower_handle: item.follower_handle,
          followeeFirstName: item.followeeFirstName,
          followeeLastName: item.followeeLastName,
          followeeAlias: item.followeeAlias,
          followeeImageUrl: item.followeeImageUrl,
          followerFirstName: item.followerFirstName,
          followerLastName: item.followerLastName,
          followerAlias: item.followerAlias,
          followerImageUrl: item.followerImageUrl,
        }))
      : [];

    console.log("followDBs from getPageOfFollowers", followDBs);
    return [followDBs, !!data.LastEvaluatedKey];
  };

  public follow = async (
    userRequestingToFollow: UserDB,
    userToFollow: UserDB
  ): Promise<void> => {
    const params = {
      TableName: "follows",
      Item: {
        follower_handle: userRequestingToFollow.alias,
        followee_handle: userToFollow.alias,

        followeeFirstName: userToFollow.firstName,
        followeeLastName: userToFollow.lastName,
        followeeAlias: userToFollow.alias,
        followeeImageUrl: userToFollow.imageUrl,

        followerFirstName: userRequestingToFollow.firstName,
        followerLastName: userRequestingToFollow.lastName,
        followerAlias: userRequestingToFollow.alias,
        followerImageUrl: userRequestingToFollow.imageUrl,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(
        `Successfully stored follow between ${userRequestingToFollow.alias} and ${userToFollow.alias} in the database`
      );
    } catch (error) {
      console.error(
        `Error storing follow between ${userRequestingToFollow.alias} and ${userToFollow.alias} in the database: ${error}`
      );
      throw new Error(
        `Error storing follow between ${userRequestingToFollow.alias} and ${userToFollow.alias} in the database: ${error}`
      );
    }
  };

  public unfollow = async (
    userRequestingToUnfollow: UserDB,
    userToUnfollow: UserDB
  ): Promise<void> => {
    const params = {
      TableName: "follows",
      Key: {
        follower_handle: userRequestingToUnfollow.alias,
        followee_handle: userToUnfollow.alias,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
      console.log(
        `Successfully deleted follow between ${userRequestingToUnfollow.alias} and ${userToUnfollow.alias} in the database`
      );
    } catch (error) {
      console.error(
        `Error deleting follow between ${userRequestingToUnfollow.alias} and ${userToUnfollow.alias} in the database: ${error}`
      );
      throw new Error(
        `Error deleting follow between ${userRequestingToUnfollow.alias} and ${userToUnfollow.alias} in the database: ${error}`
      );
    }
  };

  public getIsFollowerStatus = async (user: UserDB, selectedUser: UserDB): Promise<boolean> => {
    const params: QueryCommandInput = {
      TableName: "follows",
      KeyConditionExpression: "follower_handle = :fh and followee_handle = :sh",
      ExpressionAttributeValues: {
        ":fh": selectedUser.alias,
        ":sh": user.alias,
      },
    };

    try {
      const data = await this.client.send(new QueryCommand(params));
      console.log("data from getIsFollowerStatus", data);
      return (data?.Items?.length ?? 0) > 0;
    } catch (error) {
      console.error(
        `Error getting isFollowerStatus between ${user.alias} and ${selectedUser.alias} in the database: ${error}`
      );
      throw new Error(
        `Error getting isFollowerStatus between ${user.alias} and ${selectedUser.alias} in the database: ${error}`
      );
    }
  }
}
