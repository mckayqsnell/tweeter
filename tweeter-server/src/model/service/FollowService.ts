import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";

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

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error("[Bad Request] user for loadingFollowers does not exist");
    }

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

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error("[Bad Request] user for loadingFollowees does not exist");
    }

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

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error(
        "[Bad Request] user for getIsFollowerStatus does not exist"
      );
    }

    if (!selectedUser) {
      throw new Error(
        "[Bad Request] selectedUser for getIsFollowerStatus does not exist"
      );
    }
    // TODO: Replace with the result of calling database
    return FakeData.instance.isFollower();
  }

  public async getFolloweesCount(
    authTokenDto: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> {
    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error(
        "[Bad Request] user for getFolloweesCount does not exist"
      );
    }
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getFolloweesCount(user!);
  }

  public async getFollowersCount(
    authTokenDto: AuthTokenDto,
    userDto: UserDto
  ): Promise<number> {
    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error(
        "[Bad Request] user for getFollowersCount does not exist"
      );
    }
    // TODO: Replace with the result of calling the database
    return FakeData.instance.getFollowersCount(user!);
  }

  public async follow(
    authTokenDto: AuthTokenDto,
    userToFollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]> {
    // TODO: Call the the database
    const authToken = AuthToken.fromDto(authTokenDto);
    const userToFollow = User.fromDto(userToFollowDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!userToFollow) {
      throw new Error("[Bad Request] userToFollow for follow does not exist");
    }

    let followersCount = await this.getFollowersCount(
      authToken!,
      userToFollow!
    );
    let followeesCount = await this.getFolloweesCount(
      authToken!,
      userToFollow!
    );

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authTokenDto: AuthTokenDto,
    userToUnfollowDto: UserDto
  ): Promise<[followersCount: number, followeesCount: number]> {
    // TODO: Call the server
    const authToken = AuthToken.fromDto(authTokenDto);
    const userToUnfollow = User.fromDto(userToUnfollowDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!userToUnfollow) {
      throw new Error(
        "[Bad Request] userToUnfollow for unfollow does not exist"
      );
    }

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
