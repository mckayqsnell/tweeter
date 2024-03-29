import {
  AuthenticateResponse,
  FollowOrUnFollowRequest,
  FollowOrUnFollowResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  LoadMoreFollowItemsRequest,
  LoadMoreFollowItemsResponse,
  LoadMoreStatusItemsRequest,
  LoadMoreStatusItemsResponse,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL: string =
    "https://ur1av6d756.execute-api.us-west-2.amazonaws.com/2ndDev";

  private clientCommunicator: ClientCommunicator = new ClientCommunicator(
    this.SERVER_URL
  );

  ////////////////////////////////////
  /// UserService related methods ///
  //////////////////////////////////

  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/service/login";
    const response: AuthenticateResponse = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, endpoint);

    return response;
  }

  public async register(
    request: RegisterRequest
  ): Promise<AuthenticateResponse> {
    const endpoint = "/service/register";
    const response: AuthenticateResponse = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthenticateResponse
    >(request, endpoint);

    return response;
  }

  public async getUser(request: GetUserRequest): Promise<AuthenticateResponse> {
    const endpoint = "/service/getUser";
    const response: AuthenticateResponse = await this.clientCommunicator.doPost<
      GetUserRequest,
      AuthenticateResponse
    >(request, endpoint);

    return response;
  }

  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const endpoint = "/service/logout";
    const response: LogoutResponse = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, endpoint);

    return response;
  }

  //////////////////////////////////////
  /// StatusService related methods ///
  /////////////////////////////////////

  // LoadMoreStoryItems ---> This is not working yet (infinite requests)
  public async loadMoreStoryItems(
    request: LoadMoreStatusItemsRequest
  ): Promise<LoadMoreStatusItemsResponse> {
    const endpoint = "/service/loadMoreStoryItems";
    const response: LoadMoreStatusItemsResponse =
      await this.clientCommunicator.doPost<
        LoadMoreStatusItemsRequest,
        LoadMoreStatusItemsResponse
      >(request, endpoint);

    return response;
  }

  public async loadMoreFeedItems(
    request: LoadMoreStatusItemsRequest
  ): Promise<LoadMoreStatusItemsResponse> {
    const endpoint = "/service/loadMoreFeedItems";
    const response: LoadMoreStatusItemsResponse =
      await this.clientCommunicator.doPost<
        LoadMoreStatusItemsRequest,
        LoadMoreStatusItemsResponse
      >(request, endpoint);

    return response;
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<PostStatusResponse> {
    const endpoint = "/service/postStatus";
    const response: PostStatusResponse = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, endpoint);

    return response;
  }

  //////////////////////////////////////
  /// FollowService related methods ///
  /////////////////////////////////////

  public async loadMoreFollowers(
    request: LoadMoreFollowItemsRequest
  ): Promise<LoadMoreFollowItemsResponse> {
    const endpoint = "/service/loadMoreFollowers";
    const response: LoadMoreFollowItemsResponse =
      await this.clientCommunicator.doPost<
        LoadMoreFollowItemsRequest,
        LoadMoreFollowItemsResponse
      >(request, endpoint);

    return response;
  }

  public async loadMoreFollowees(
    request: LoadMoreFollowItemsRequest
  ): Promise<LoadMoreFollowItemsResponse> {
    const endpoint = "/service/loadMoreFollowees";
    const response: LoadMoreFollowItemsResponse =
      await this.clientCommunicator.doPost<
        LoadMoreFollowItemsRequest,
        LoadMoreFollowItemsResponse
      >(request, endpoint);

    return response;
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<GetIsFollowerStatusResponse> {
    const endpoint = "/service/getIsFollower";
    const response: GetIsFollowerStatusResponse =
      await this.clientCommunicator.doPost<
        GetIsFollowerStatusRequest,
        GetIsFollowerStatusResponse
      >(request, endpoint);

    return response;
  }

  public async getFollowersCount(
    request: GetFollowCountRequest
  ): Promise<GetFollowCountResponse> {
    const endpoint = "/service/getFollowersCount";
    const response: GetFollowCountResponse =
      await this.clientCommunicator.doPost<
        GetFollowCountRequest,
        GetFollowCountResponse
      >(request, endpoint);

    return response;
  }

  public async getFolloweesCount(
    request: GetFollowCountRequest
  ): Promise<GetFollowCountResponse> {
    const endpoint = "/service/getFolloweesCount";
    const response: GetFollowCountResponse =
      await this.clientCommunicator.doPost<
        GetFollowCountRequest,
        GetFollowCountResponse
      >(request, endpoint);

    return response;
  }

  public async follow(
    request: FollowOrUnFollowRequest
  ): Promise<FollowOrUnFollowResponse> {
    const endpoint = "/service/follow";
    const response: FollowOrUnFollowResponse =
      await this.clientCommunicator.doPost<
        FollowOrUnFollowRequest,
        FollowOrUnFollowResponse
      >(request, endpoint);

    return response;
  }

  public async unFollow(
    request: FollowOrUnFollowRequest
  ): Promise<FollowOrUnFollowResponse> {
    const endpoint = "/service/unfollow";
    const response: FollowOrUnFollowResponse =
      await this.clientCommunicator.doPost<
        FollowOrUnFollowRequest,
        FollowOrUnFollowResponse
      >(request, endpoint);

    return response;
  }
}
