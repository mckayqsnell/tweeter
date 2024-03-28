import { AuthToken, AuthTokenDto, FakeData, Status, StatusDto, User } from "tweeter-shared";

export class StatusService {
  public async loadMoreStoryItems(
    authToken: AuthTokenDto,
    user: User,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[Status[], boolean]> {
    // TODO: Convert authTokenDto to AuthToken
    // convert StatusDto to Status
    const lastStatusItem = Status.fromDto(lastItem);
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
  }

  public async loadMoreFeedItems(
    authToken: AuthTokenDto,
    user: User,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[Status[], boolean]> {
    // TODO: Convert authTokenDto to AuthToken
    // convert StatusDto to Status
    const lastStatusItem = Status.fromDto(lastItem);
    return FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
  }

  public async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto
  ): Promise<void> {
    // TODO: Convert authTokenDto to AuthToken
    // TODO: convert StatusDto to Status
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
