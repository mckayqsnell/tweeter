import { AuthToken, AuthTokenDto, FakeData, Status, StatusDto, User, UserDto } from "tweeter-shared";

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

    console.log("Last status item: ", lastStatusItem)
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
    // TODO: Replace with the result of calling database
    return FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
  }

  public async postStatus(
    authTokenDto: AuthTokenDto,
    newStatusDto: StatusDto
  ): Promise<void> {
    const authToken = AuthToken.fromDto(authTokenDto);
    const newStatus = Status.fromDto(newStatusDto);
    // Pause so we can see the logging out message. Remove when connected to the server
    // TODO: Replace with the result of calling database
    await new Promise((f) => setTimeout(f, 2000));
  }
}
