import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[User[], boolean]> {

    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);
    const lastUserItem = User.fromDto(lastItem);
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getPageOfUsers(lastUserItem, pageSize, user);
  }

  public async loadMoreFollowees(
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[User[], boolean]> {
    
    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);
    const lastUserItem = User.fromDto(lastItem);
    // TODO: Replace with the result of calling database
    return FakeData.instance.getPageOfUsers(lastUserItem, pageSize, user);
  }

  public async getIsFollowerStatus(
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    selectedUserDto: UserDto
  ): Promise<boolean> {

    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);
    const selectedUser = User.fromDto(selectedUserDto);
    // TODO: Replace with the result of calling database
    return FakeData.instance.isFollower();
  }

  public async getFolloweesCount(
    authTokenDto: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> {
    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getFolloweesCount(user!);
  }

  public async getFollowersCount(
    authTokenDto: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> {

    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getFollowersCount(user!);
  }

  public async follow(
    authTokenDto: AuthTokenDto,
    userToFollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the the database
    const authToken = AuthToken.fromDto(authTokenDto);
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
    const authToken = AuthToken.fromDto(authTokenDto);
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
