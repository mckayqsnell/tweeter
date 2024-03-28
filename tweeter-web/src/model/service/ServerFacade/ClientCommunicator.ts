import { TweeterRequest } from "tweeter-shared/src/model/net/Request";
import { TweeterResponse } from "tweeter-shared/src/model/net/Response";

export class ClientCommunicator {
  private SERVER_URL: string;

  constructor(serverUrl: string) {
    this.SERVER_URL = serverUrl;
  }

  async doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ,
    endpoint: string
  ): Promise<RES> {
    const url = this.SERVER_URL + endpoint;
    const request = {
      method: "post",
      headers: new Headers({
        "Content-type": "application/json",
      }),
      body: JSON.stringify(req),
    };

    try {
      const resp: Response = await fetch(url, request);
      
      if (resp.ok) {
        const response: RES = await resp.json();
        return response;
      } else {
        const error = await resp.json();
        throw new Error(error.errorMessage);
      }
    } catch (err) {
      throw new Error(
        "Client communicator doPost failed:\n" + (err as Error).message
      );
    }
  }
}