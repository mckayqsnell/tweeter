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

export class StatusService extends BaseService {
  private feedDAO: IFeedDAO;
  private storyDAO: IStoryDAO;
  private followDAO: IFollowDAO;

  constructor(factory: IDAOFactory, authService: AuthService) {
    super(factory, authService);
    this.feedDAO = factory.getFeedDAO();
    this.storyDAO = factory.getStoryDAO();
    this.followDAO = factory.getFollowDAO();
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
      // get all the followers of that user
      const [followers, hasMore] = await this.followDAO.getPageOfFollowers(
        newStatusDto.user!.alias,
        20, // this will change
        undefined
      );
      console.log(`followers of ${newStatusDto.user!.alias}: ${followers}`);

      // post to the feed of each follower
      const feedUpdates = followers.map((follower: FollowDB) => ({
        reciever_alias: follower.followerAlias,
        timestamp: newStatusDto.timestamp,
        post: newStatusDto.post,
        sender_alias: newStatusDto.user!.alias,
        sender_firstName: newStatusDto.user!.firstName,
        sender_lastName: newStatusDto.user!.lastName,
        sender_imageUrl: newStatusDto.user!.imageUrl,
      }));

      console.log(`feedUpdates: ${feedUpdates}`)

      // FIXME: Milestone4b --> this isn't efficent and will change.
      // post to the feed of each follower
      await this.batchWriteFeedUpdates(feedUpdates);

    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to post status: ${error}`
      );
    }
  }

  private async batchWriteFeedUpdates(feedUpdates: FeedDB[]) {
    const BATCH_SIZE = 25;
    for (let i = 0; i < feedUpdates.length; i += BATCH_SIZE) {
      const batch = feedUpdates.slice(i, i + BATCH_SIZE);
      await this.feedDAO.postFeedItems(batch);
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
