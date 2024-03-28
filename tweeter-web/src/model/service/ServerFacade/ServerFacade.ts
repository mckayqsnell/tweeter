import { AuthenticateResponse, GetUserRequest, LoginRequest, LogoutRequest, LogoutResponse, RegisterRequest } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL: string =
    "https://ur1av6d756.execute-api.us-west-2.amazonaws.com/2ndDev";

  private clientCommunicator: ClientCommunicator = new ClientCommunicator(
    this.SERVER_URL
  );

  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/service/login";
    const response: AuthenticateResponse = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, endpoint);

    return response;
  }

  public async register(request: RegisterRequest): Promise<AuthenticateResponse> {
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
}