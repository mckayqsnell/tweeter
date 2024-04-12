import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";
import { IFollowDAO } from "../daos/interfaces/IFollowDAO";
import { IDAOFactory } from "../factory/IDAOFactory";
import { BaseService } from "./BaseService";
import { AuthService } from "./AuthService";
import { FollowDB, UserDB } from "../DatabaseTypes";
import { IUserDAO } from "../daos/interfaces/IUserDAO";

export class FollowService extends BaseService {
  private followDAO: IFollowDAO;
  private userDAO: IUserDAO;

  constructor(factory: IDAOFactory, authService: AuthService) {
    super(factory, authService);
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
  }

  public loadMoreFollowers = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    console.log("loadMoreFollowers in follow service");
    console.log("authTokenDto", authTokenDto);
    console.log("userDto", userDto);
    console.log("pageSize", pageSize);
    console.log("lastItem", lastItem);

    return this.loadMore(
      authTokenDto,
      userDto,
      pageSize,
      lastItem,
      true,
      this.followDAO.getPageOfFollowers
    );
  }

  public loadMoreFollowees = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    console.log("loadMoreFollowees in follow service");
    console.log("authTokenDto", authTokenDto);
    console.log("userDto", userDto);
    console.log("pageSize", pageSize);
    console.log("lastItem", lastItem);

    return this.loadMore(
      authTokenDto,
      userDto,
      pageSize,
      lastItem,
      false,
      this.followDAO.getPageOfFollowees
    );
  }

  private loadMore =  async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: UserDto | null,
    follower: boolean,
    daoFunction: (
      alias: string,
      pageSize: number,
      lastItemAlias: string | undefined
    ) => Promise<[FollowDB[], boolean]>
  ): Promise<[UserDto[], boolean]> => {
    this.validateRequiredFields([authTokenDto, userDto, pageSize]);

    try {
      //validate the authToken
      const validated = await this.authService.validateAuthToken(authTokenDto);
      if (!validated) {
        throw new Error("[AuthError] unauthenticated request");
      }
      const lastItemAlias = lastItem ? lastItem.alias : undefined; // check if lastItem is present
      const [follows, hasMore] = await daoFunction(
        userDto.alias,
        pageSize,
        lastItemAlias
      );

      console.log(`follows: ${follows} hasMore: ${hasMore}`);

      //convert the follows to UserDtos
      const followsDto = follows.map((follow) =>
        this.followDBToDto(follow, follower)
      );

      console.log(`followsDto: ${followsDto} hasMore: ${hasMore}`);

      return [followsDto, hasMore];
    } catch (error) {
      console.error(error);
      throw new Error(`[Internal Server Error] failed to load more: ${error}`);
    }
  }


  public getIsFollowerStatus = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    selectedUserDto: UserDto
  ): Promise<boolean> => {
    console.log("getIsFollowerStatus in follow service");
    console.log("authTokenDto", authTokenDto);
    console.log("userDto", userDto);
    console.log("selectedUserDto", selectedUserDto);

    this.validateRequiredFields([authTokenDto, userDto, selectedUserDto]);

    try {
      //validate the authToken
      const validated = await this.authService.validateAuthToken(authTokenDto);
      if (!validated) {
        throw new Error("[AuthError] unauthenticated request");
      }

      const alias = await this.authService.getAlias(authTokenDto);

      // lookup the user in the database
      const user = await this.userDAO.getUser(alias);

      if (!user) {
        throw new Error(
          `[Bad Request] user ${alias} who wants to getIsFollowerStatus does not exist`
        );
      }

      const selectedUser = await this.userDAO.getUser(selectedUserDto.alias);

      if (!selectedUser) {
        throw new Error(
          `[Bad Request] selectedUser for getIsFollowerStatus does not exist`
        );
      }

      const isFollower = await this.followDAO.getIsFollowerStatus(user, selectedUser);

      console.log(`isFollower: ${isFollower} for ${selectedUserDto.alias}`);

      return isFollower;
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to get isFollowerStatus: ${error}`
      );
    }
  }

  public getFolloweesCount = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> => {
    return this.getFollowCounts(
      authTokenDto,
      userDto,
      (alias: string) => this.userDAO.getUser(alias),
      "followees"
    );
  }

  public getFollowersCount = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> => {
    return this.getFollowCounts(
      authTokenDto,
      userDto,
      (alias: string) => this.userDAO.getUser(alias),
      "followers"
    );
  }

  private getFollowCounts = async (
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    daoFunction: (alias: string) => Promise<UserDB>,
    operation: string
  ): Promise<number> => {
    console.log("getFollowCounts in follow service");
    console.log("authTokenDto", authTokenDto);
    console.log("userDto", userDto);

    this.validateRequiredFields([authTokenDto, userDto]);

    try {
      //validate the authToken
      const validated = await this.authService.validateAuthToken(authTokenDto);
      if (!validated) {
        throw new Error("[AuthError] unauthenticated request");
      }

      const user = await daoFunction(userDto.alias);
      if (!user) {
        throw new Error(
          `[Bad Request] user for getFollowCounts does not exist`
        );
      }

      const count = operation === "followers" ? user.followersCount : user.followeesCount;
      console.log(`count: ${count} returned for ${userDto.alias}`);

      return count;
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to get follow count: ${error}`
      );
    }
  }

  public follow = async (
    authTokenDto: AuthTokenDto,
    userToFollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]>  => {
    return this.unFollowOrFollow(
      authTokenDto,
      userToFollowDto,
      this.followDAO.follow,
      "follow"
    );
  }

  public unfollow = async (
    authTokenDto: AuthTokenDto,
    userToUnfollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]> => {
    return this.unFollowOrFollow(
      authTokenDto,
      userToUnfollowDto,
      this.followDAO.unfollow,
      "unfollow"
    );
  }

  private unFollowOrFollow = async (
    authTokenDto: AuthTokenDto,
    userToUnfollowDto: UserDto,
    daoFunction: (follow: UserDB, followee: UserDB) => Promise<void>,
    operation: string
  ): Promise<[followersCount: number, followeesCount: number]> => {
    this.validateRequiredFields([authTokenDto, userToUnfollowDto]);

    try {
      await this.validateAuthToken(authTokenDto);

      const alias = await this.authService.getAlias(authTokenDto);

      // lookup the user in the database
      const userdb = await this.userDAO.getUser(alias);

      if (!userdb) {
        throw new Error(
          `[Bad Request] user ${alias} who wants to ${operation} does not exist`
        );
      }

      const userToUnfollowOrFollow = await this.userDAO.getUser(
        userToUnfollowDto.alias
      );

      if (!userToUnfollowOrFollow) {
        throw new Error(
          `[Bad Request] userTo${operation} for ${operation} does not exist`
        );
      }

      if(operation === "follow") {
        await this.userDAO.incrementFolloweesCount(alias);
        await this.userDAO.incrementFollowersCount(userToUnfollowDto.alias);
      } else {
        await this.userDAO.decrementFolloweesCount(alias);
        await this.userDAO.decrementFollowersCount(userToUnfollowDto.alias);
      }

      await daoFunction(userdb, userToUnfollowOrFollow);

      // get the updated counts for this user
      const updatedUser = await this.userDAO.getUser(alias);
      const followersCount = updatedUser.followersCount;
      const followeesCount = updatedUser.followeesCount;

      return [followersCount, followeesCount];
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to ${operation}: ${error}`
      );
    }
  }

  public followDBToDto = (followDB: FollowDB, follower: boolean): UserDto => {
    if (follower) {
      return {
        alias: followDB.followerAlias,
        firstName: followDB.followerFirstName,
        imageUrl: followDB.followerImageUrl,
        lastName: followDB.followerLastName,
      };
    } else {
      return {
        alias: followDB.followeeAlias,
        firstName: followDB.followeeFirstName,
        imageUrl: followDB.followeeImageUrl,
        lastName: followDB.followeeLastName,
      };
    }
  }
}
