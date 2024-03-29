import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  Status,
  StatusDto,
  User,
  UserDto,
} from "tweeter-shared";

export class StatusService {
  public async loadMoreStoryItems(
    authTokeDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItemDto: StatusDto | null
  ): Promise<[Status[], boolean]> {
    const authToken = AuthToken.fromDto(authTokeDto);
    const user = User.fromDto(userDto);
    const lastStatusItem = Status.fromDto(lastItemDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error(
        "[Bad Request] user for loadingStoryItems does not exist"
      );
    }

    // console.log("Last status item: ", lastStatusItem)
    // TODO: Replace with the result of calling database
    return FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
  }

  public async loadMoreFeedItems(
    authTokenDto: AuthTokenDto,
    userDto: UserDto,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[Status[], boolean]> {
    const authToken = AuthToken.fromDto(authTokenDto);
    const user = User.fromDto(userDto);
    const lastStatusItem = Status.fromDto(lastItem);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!user) {
      throw new Error("[Bad Request] user for loadingFeedItems does not exist");
    }
    // TODO: Replace with the result of calling database
    return FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
  }

  public async postStatus(
    authTokenDto: AuthTokenDto,
    newStatusDto: StatusDto
  ): Promise<void> {
    const authToken = AuthToken.fromDto(authTokenDto);
    const newStatus = Status.fromDto(newStatusDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    if (!newStatus) {
      throw new Error("[Bad Request] new status is invalid or empty");
    }

    // TODO: Replace with the result of calling database
  }
}
