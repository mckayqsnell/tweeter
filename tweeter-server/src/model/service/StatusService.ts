import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  Status,
  StatusDto,
  User,
  UserDto,
} from "tweeter-shared";
import { IFeedDAO } from "../daos/interfaces/IFeedDAO";
import { IStoryDAO } from "../daos/interfaces/IStoryDAO";
import { IDAOFactory } from "../factory/IDAOFactory";
import { BaseService } from "./BaseService";
import { AuthService } from "./AuthService";
import { FeedDB, FollowDB, StoryDB } from "../DatabaseTypes";
import { IFollowDAO } from "../daos/interfaces/IFollowDAO";
import { SQSSender } from "../sqs/SQSSender";

const POSTSTATUSQUEUEURL =
  "https://sqs.us-west-2.amazonaws.com/108857565390/postStatusQueue";

export class StatusService extends BaseService {
  private feedDAO: IFeedDAO;
  private storyDAO: IStoryDAO;
  private sqsClient = new SQSSender(POSTSTATUSQUEUEURL);

  constructor(factory: IDAOFactory, authService: AuthService) {
    super(factory, authService);
    this.feedDAO = factory.getFeedDAO();
    this.storyDAO = factory.getStoryDAO();
  }

  public async loadMoreStoryItems(
    authTokeDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItemDto: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.validateRequiredFields([authTokeDto, userDto, pageSize]);

    try {
      // validate the authToken
      const validated = await this.authService.validateAuthToken(authTokeDto);
      if (!validated) {
        throw new Error("[AuthError] unauthenticated request");
      }

      const lastItemTimestamp = lastItemDto ? lastItemDto.timestamp : undefined;
      const [items, hasMore] = await this.storyDAO.loadMoreStoryItems(
        userDto.alias,
        pageSize,
        lastItemTimestamp
      );

      console.log(`items ${items} hasMore: ${hasMore} from loadMoreStoryItems`);

      // convert the items to StatusDtos
      const statusDtos = items.map((story: StoryDB) =>
        this.storyDBToStatusDto(story)
      );

      console.log(
        `StatusDtos ${statusDtos} hasMore: ${hasMore} from loadMoreStoryItems`
      );

      return [statusDtos, hasMore];
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to load more story items: ${error}`
      );
    }
  }

  public loadMoreFeedItems = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    this.validateRequiredFields([authTokenDto, userDto, pageSize]);

    try {
      // validate the authToken
      const validated = await this.authService.validateAuthToken(authTokenDto);
      if (!validated) {
        throw new Error("[AuthError] unauthenticated request");
      }

      const lastItemTimestamp = lastItem ? lastItem.timestamp : undefined; // check if lastItem is present
      const [items, hasMore] = await this.feedDAO.loadMoreFeedItems(
        userDto.alias,
        pageSize,
        lastItemTimestamp
      );

      console.log(`items ${items} hasMore: ${hasMore} from loadMoreFeedItems`);

      // convert the items to StatusDtos
      const statusDtos = items.map((feed: FeedDB) =>
        this.feedDBToStatusDto(feed)
      );

      console.log(
        `StatusDtos ${statusDtos} hasMore: ${hasMore} from loadMoreFeedItems`
      );

      return [statusDtos, hasMore];
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to load more feed items: ${error}`
      );
    }
  };

  public async postStatus(
    authTokenDto: AuthTokenDto,
    newStatusDto: StatusDto
  ): Promise<void> {
    this.validateRequiredFields([authTokenDto, newStatusDto]);

    try {
      // validate the authToken
      const validated = await this.authService.validateAuthToken(authTokenDto);
      if (!validated) {
        throw new Error("[AuthError] unauthenticated request");
      }
      // post to the users own story
      const newStatusStoryDB = this.storyDtoToStoryDB(newStatusDto);
      await this.storyDAO.postStoryItem(newStatusStoryDB);

      // update the feed of everyone who follows that user
      // Milestone 4b
      // construct the message for SQS
      const message = {
        senderAlias: newStatusDto.user!.alias, // alias of the user who posted the status
        timestamp: newStatusDto.timestamp,
        post: newStatusDto.post,
        senderFirstName: newStatusDto.user!.firstName,
        senderLastName: newStatusDto.user!.lastName,
        senderImageUrl: newStatusDto.user!.imageUrl,
      };

      await this.sqsClient.sendMessage(JSON.stringify(message));
      console.log(`message sent to SQS: ${message}`)
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to post status: ${error}`
      );
    }
  }

  private feedDBToStatusDto = (feed: FeedDB): StatusDto => {
    return {
      timestamp: feed.timestamp,
      post: feed.post,
      user: {
        alias: feed.sender_alias,
        firstName: feed.sender_firstName,
        lastName: feed.sender_lastName,
        imageUrl: feed.sender_imageUrl,
      },
    };
  };

  private storyDBToStatusDto = (story: StoryDB): StatusDto => {
    return {
      timestamp: story.timestamp,
      post: story.post,
      user: {
        alias: story.sender_alias,
        firstName: story.sender_firstName,
        lastName: story.sender_lastName,
        imageUrl: story.sender_imageUrl,
      },
    };
  };

  private feedDtoToFeedDB = (statusDto: StatusDto): FeedDB => {
    return {
      reciever_alias: statusDto.user!.alias,
      timestamp: statusDto.timestamp,
      post: statusDto.post,
      sender_firstName: statusDto.user!.firstName,
      sender_lastName: statusDto.user!.lastName,
      sender_alias: statusDto.user!.alias,
      sender_imageUrl: statusDto.user!.imageUrl,
    };
  };

  private storyDtoToStoryDB = (statusDto: StatusDto): StoryDB => {
    return {
      sender_alias: statusDto.user!.alias,
      timestamp: statusDto.timestamp,
      post: statusDto.post,
      sender_firstName: statusDto.user!.firstName,
      sender_lastName: statusDto.user!.lastName,
      sender_imageUrl: statusDto.user!.imageUrl,
    };
  };
}
