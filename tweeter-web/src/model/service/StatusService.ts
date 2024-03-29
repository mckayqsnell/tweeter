import { AuthToken, FakeData, LoadMoreStatusItemsRequest, PostStatusRequest, Status, User } from "tweeter-shared";
import { ServerFacade } from "./ServerFacade/ServerFacade";

export class StatusService {

  private serverFacade: ServerFacade = new ServerFacade();
  
  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {

    const request: LoadMoreStatusItemsRequest = {
      authToken: authToken,
      user: user,
      pageSize: pageSize,
      lastItem: lastItem
    }

    // Call the server
    const response = await this.serverFacade.loadMoreStoryItems(request);

    if (!response.success) {
      throw new Error(response.message || "Invalid request");
    }

    return [response.statusItems.map((status) => Status.fromDto(status)!), response.hasMorePages];
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {

    const request: LoadMoreStatusItemsRequest = {
      authToken: authToken,
      user: user,
      pageSize: pageSize,
      lastItem: lastItem,
    };

    // Call the server
    const response = await this.serverFacade.loadMoreFeedItems(request);

    if (!response.success) {
      throw new Error(response.message || "Invalid request");
    }

    return [
      response.statusItems.map((status) => Status.fromDto(status)!),
      response.hasMorePages,
    ];
  }

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {

    // Build up a postStatus request object
    const request: PostStatusRequest = {
      authToken: authToken,
      newStatus: newStatus
    }

    // Call the server
    const response = await this.serverFacade.postStatus(request);

    if (!response.success) {
      throw new Error(response.message || "Invalid request");
    }

    return;
  };
}