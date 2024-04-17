import { AuthTokenDto } from "tweeter-shared";
import { IAuthTokenDAO } from "../interfaces/IAuthTokenDAO";
import { AuthTokenDB } from "../../DatabaseTypes";
import { DynamoDAO } from "./DynamoDAO";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoAuthTokenDAO extends DynamoDAO implements IAuthTokenDAO {
  public getToken = async (token: string): Promise<AuthTokenDB> => {
    if (!token) {
      console.error("getToken called with undefined or null token");
      throw new Error("getToken called with undefined or null token");
    }

    const params = {
      TableName: "authtokens",
      Key: {
        token: token,
      },
    };

    try {
      const response = await this.client.send(new GetCommand(params));
      console.log(`Successfully retrieved token ${token} from the database`);

      console.log("response.Item", response.Item)

      const authtoken = response.Item as AuthTokenDB;
      console.log("authtoken", authtoken)

      return authtoken;
    } catch (error) {
      console.error(
        `Error retrieving token ${token} from the database: ${error}`
      );
      throw new Error(
        `Error retrieving token ${token} from the database: ${error}`
      );
    }
  };

  public storeToken = async (authTokenDB: AuthTokenDB): Promise<void> => {
    const params = {
      TableName: "authtokens",
      Item: {
        token: authTokenDB.token,
        expiretime: authTokenDB.expiretime,
        alias: authTokenDB.alias,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(
        `Successfully stored token ${authTokenDB.token} in the database`
      );
    } catch (error) {
      console.error(
        `Error storing token ${authTokenDB.token} in the database: ${error}`
      );
      throw new Error(
        `Error storing token ${authTokenDB.token} in the database: ${error}`
      );
    }
  };

  public deleteToken = async (token: string): Promise<void> => {
    console.log(`Deleting token ${token} in DynamoAuthTokenDAO`);
    const params = {
      TableName: "authtokens",
      Key: {
        token: token,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
      console.log(`Successfully deleted token ${token} from the database`);
    } catch (error) {
      console.error(
        `Error deleting token ${token} from the database: ${error}`
      );
      throw new Error(
        `Error deleting token ${token} from the database: ${error}`
      );
    }
  };
}
