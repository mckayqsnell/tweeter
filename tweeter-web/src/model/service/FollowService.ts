import { AuthToken, FakeData, FollowOrUnFollowRequest, GetFollowCountRequest, GetIsFollowerStatusRequest, LoadMoreFollowItemsRequest, User } from "tweeter-shared";
import { ServerFacade } from "./ServerFacade/ServerFacade";

export class FollowService {

  private serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // Build up a LoadMoreFollowItemsRequest
    const request: LoadMoreFollowItemsRequest = {
      authToken: authToken,
      user: user,
      pageSize: pageSize,
      lastItem: lastItem
    }

    // Call the server
    const response = await this.serverFacade.loadMoreFollowers(request);

    if (!response.success) {
      throw new Error(
        response.message || "unsuccessful request for loadMoreFollowers"
      );
    }

    return [response.users.map((user) => User.fromDto(user)!), response.hasMorePages];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // Build up a LoadMoreFollowItemsRequest
    const request: LoadMoreFollowItemsRequest = {
      authToken: authToken,
      user: user,
      pageSize: pageSize,
      lastItem: lastItem,
    };

    // Call the server
    const response = await this.serverFacade.loadMoreFollowees(request);

    if (!response.success) {
      throw new Error(response.message || "unsuccessful request for loadMoreFollowees");
    }

    return [
      response.users.map((user) => User.fromDto(user)!),
      response.hasMorePages,
    ];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // Build up a getIsFollowerStatus request object
    const request: GetIsFollowerStatusRequest = {
      authToken: authToken,
      user: user,
      selectedUser: selectedUser
    }

    // Call the server
    const response = await this.serverFacade.getIsFollowerStatus(request);

    if (!response.success) {
      throw new Error(response.message || "unsuccessful request for follower status");
    }

    return response.isFollower;
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // // TODO: Replace with the result of calling server
    // return FakeData.instance.getFolloweesCount(user);

    const request: GetFollowCountRequest = {
      authToken: authToken,
      user: user,
    };

    // Call the server
    const response = await this.serverFacade.getFolloweesCount(request);

    if (!response.success) {
      throw new Error(response.message || "Unsuccessful request for followees count");
    }

    return response.count;
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // // TODO: Replace with the result of calling server
    // return FakeData.instance.getFollowersCount(user);

    // Build up a getFollowersCount request object
    const request: GetFollowCountRequest = {
      authToken: authToken,
      user: user
    }

    // Call the server
    const response = await this.serverFacade.getFollowersCount(request);

    if (!response.success) {
      throw new Error(response.message || "unsuccessful request for followers count");
    }

    return response.count;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // // Pause so we can see the following message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // // TODO: Call the server

    // let followersCount = await this.getFollowersCount(authToken, userToFollow);
    // let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    // return [followersCount, followeesCount];

    // Build up a follow/unfollow request object
    const request: FollowOrUnFollowRequest = {
      authToken: authToken,
      userToFollowOrUnFollow: userToFollow
    }

    // Call the server
    const response = await this.serverFacade.follow(request);

    if (!response.success) {
      throw new Error(response.message || "unsuccessful request for follow");
    }

    return [response.followersCount, response.followeesCount];
  }

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    const request: FollowOrUnFollowRequest = {
      authToken: authToken,
      userToFollowOrUnFollow: userToUnfollow
    }

    // Call the server
    const response = await this.serverFacade.unFollow(request);

    if (!response.success) {
      throw new Error(response.message || "unsuccessful request for unfollow");
    }

    return [response.followersCount, response.followeesCount];
  };
}