import { AuthToken, FakeData, LoginRequest, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "./ServerFacade/ServerFacade"

export class UserService {

  private serverFacade: ServerFacade = new ServerFacade();

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User , AuthToken]> {

    //Build up the LoginRequest object
    const request: LoginRequest = {
      alias: alias,
      password: password
    }
    //Call the server
    const response = await this.serverFacade.login(request);

    if(!response.success){
      throw new Error(response.message || "Invalid alias or password");
    }

    if(response.user === null || response.token === null){
      throw new Error(response.message || "Invalid alias or password");
    }

    return [User.fromDto(response.user)!, AuthToken.fromDto(response.token)!];
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async logout (authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
