import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthTokenDto,
    user: User,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[User[], boolean]> {
    // Convert AuthTokenDto to AuthToken
    // convert UserDto to User
    let lastUserItem = User.fromDto(lastItem);
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getPageOfUsers(lastUserItem, pageSize, user);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[User[], boolean]> {
    // TODO: Convert AuthTokenDto to AuthToken
    // convert UserDto to User
    let lastUserItem = User.fromDto(lastItem);
    // TODO: Replace with the result of calling database
    return FakeData.instance.getPageOfUsers(lastUserItem, pageSize, user);
  }

  public async getIsFollowerStatus(
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Convert AuthTokenDto to AuthToken
    // TODO: convert UserDto to User for both user and selectedUser
    // TODO: Replace with the result of calling database
    return FakeData.instance.isFollower();
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    userDto: UserDto
  ): Promise<number> {
    // TODO: Convert AuthTokenDto to AuthToken
    // convert UserDto to User
    const user = User.fromDto(userDto);
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getFolloweesCount(user!);
  }

  public async getFollowersCount(
    authToken: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> {
    // TODO: Convert AuthTokenDto to AuthToken
    // convert UserDto to User
    const user = User.fromDto(userDto);
    return FakeData.instance.getFollowersCount(user!);
  }

  public async follow(
    authTokenDto: AuthTokenDto,
    userToFollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the the database
    // Convert AuthTokenDto to AuthToken
    const authToken = AuthToken.fromDto(authTokenDto);
    // convert UserDto to User
    const userToFollow = User.fromDto(userToFollowDto);

    let followersCount = await this.getFollowersCount(authToken!, userToFollow!);
    let followeesCount = await this.getFolloweesCount(authToken!, userToFollow!);

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authTokenDto: AuthTokenDto,
    userToUnfollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    // Convert AuthTokenDto to AuthToken
    const authToken = AuthToken.fromDto(authTokenDto);
    // convert UserDto to User
    const userToUnfollow = User.fromDto(userToUnfollowDto);

    let followersCount = await this.getFollowersCount(
      authToken!,
      userToUnfollow!
    );
    let followeesCount = await this.getFolloweesCount(
      authToken!,
      userToUnfollow!
    );

    return [followersCount, followeesCount];
  }
}
