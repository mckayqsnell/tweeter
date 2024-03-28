import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL: string =
    "https://ur1av6d756.execute-api.us-west-2.amazonaws.com/firstDev";

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
}