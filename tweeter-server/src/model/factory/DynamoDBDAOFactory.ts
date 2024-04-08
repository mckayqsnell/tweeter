import { DynamoAuthTokenDAO } from "../daos/dynamodb/DynamoAuthTokenDAO";
import { DynamoFeedDAO } from "../daos/dynamodb/DynamoFeedDAO";
import { DynamoFollowDAO } from "../daos/dynamodb/DynamoFollowDAO";
import { DynamoStoryDAO } from "../daos/dynamodb/DynamoStoryDAO";
import { DynamoUserDAO } from "../daos/dynamodb/DynamoUserDAO";
import { IDAOFactory } from "./IDAOFactory";

export class DynamoDBDAOFactory implements IDAOFactory {
  private static instance: DynamoDBDAOFactory;

    private constructor() {}

    public static getInstance(): DynamoDBDAOFactory {
        if (!DynamoDBDAOFactory.instance) {
            DynamoDBDAOFactory.instance = new DynamoDBDAOFactory();
        }

        return DynamoDBDAOFactory.instance;
    }

  public getUserDAO(): DynamoUserDAO {
    return new DynamoUserDAO();
  }

  public getFeedDAO(): DynamoFeedDAO {
    return new DynamoFeedDAO();
  }

  public getFollowDAO(): DynamoFollowDAO {
    return new DynamoFollowDAO();
  }

  public getStoryDAO(): DynamoStoryDAO {
    return new DynamoStoryDAO();
  }

  public getAuthTokenDAO(): DynamoAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }
}
