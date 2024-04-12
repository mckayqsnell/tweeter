import { DynamoAuthTokenDAO } from "../daos/dynamodb/DynamoAuthTokenDAO";
import { DynamoFeedDAO } from "../daos/dynamodb/DynamoFeedDAO";
import { DynamoFollowDAO } from "../daos/dynamodb/DynamoFollowDAO";
import { DynamoStoryDAO } from "../daos/dynamodb/DynamoStoryDAO";
import { DynamoUserDAO } from "../daos/dynamodb/DynamoUserDAO";
import { S3StorageDAO } from "../daos/dynamodb/S3StorageDAO";
import { IDAOFactory } from "./IDAOFactory";

export class DynamoDBDAOFactory implements IDAOFactory {
  private static instance: DynamoDBDAOFactory;
  private userDAO: DynamoUserDAO;
  private feedDAO: DynamoFeedDAO;
  private followDAO: DynamoFollowDAO;
  private storyDAO: DynamoStoryDAO;
  private authTokenDAO: DynamoAuthTokenDAO;
  private s3StorageDAO: S3StorageDAO;

  private constructor() {
    this.userDAO = new DynamoUserDAO();
    this.feedDAO = new DynamoFeedDAO();
    this.followDAO = new DynamoFollowDAO();
    this.storyDAO = new DynamoStoryDAO();
    this.authTokenDAO = new DynamoAuthTokenDAO();
    this.s3StorageDAO = new S3StorageDAO();
  }

  public static getInstance(): DynamoDBDAOFactory {
    if (!DynamoDBDAOFactory.instance) {
      DynamoDBDAOFactory.instance = new DynamoDBDAOFactory();
    }

    return DynamoDBDAOFactory.instance;
  }

  public getUserDAO(): DynamoUserDAO {
    return this.userDAO;
  }

  public getFeedDAO(): DynamoFeedDAO {
    return this.feedDAO;
  }

  public getFollowDAO(): DynamoFollowDAO {
    return this.followDAO;
  }

  public getStoryDAO(): DynamoStoryDAO {
    return this.storyDAO;
  }

  public getAuthTokenDAO(): DynamoAuthTokenDAO {
    return this.authTokenDAO;
  }

  public getS3StorageDAO(): S3StorageDAO {
    return this.s3StorageDAO;
  }
}
