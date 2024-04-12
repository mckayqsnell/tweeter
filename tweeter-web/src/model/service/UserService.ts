import {
  AuthToken,
  GetUserRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "./ServerFacade/ServerFacade";

export class UserService {
  private serverFacade: ServerFacade = new ServerFacade();

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    //Build up the RegisterRequest object
    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: `@${alias}`, // Add the @ symbol to the alias for front end parsing
      password: password,
      imageStringBase64: imageStringBase64,
    };

    try {
      //Call the server
      const response = await this.serverFacade.register(request);

      if (!response.success) {
        throw new Error(response.message || "Invalid registration");
      }

      if (response.user === null) {
        throw new Error(response.message || "Login failed: User is null");
      }

      if (response.token === null) {
        throw new Error(response.message || "Login failed: token is null");
      }

      return [User.fromDto(response.user)!, AuthToken.fromDto(response.token)!];
    } catch (error) {
      console.error(error);
      throw new Error("Failed to register due to an unexpected error");
    }
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User , AuthToken]> {
    //Build up the LoginRequest object
    const request: LoginRequest = {
      alias: `@${alias}`, // Add the @ symbol to the alias for front end parsing
      password: password,
    };
    //Call the server
    try {
      const response = await this.serverFacade.login(request);

      if (!response.success) {
        throw new Error(response.message || "Invalid alias or password");
      }

      if (response.user === null) {
        throw new Error(response.message || "Login failed: User is null");
      }

      if (response.token === null) {
        throw new Error(response.message || "Login failed: token is null");
      }

      return [User.fromDto(response.user)!, AuthToken.fromDto(response.token)!];
    } catch (error) {
      console.error(error);
      throw new Error("Failed to login due to an unexpected error");
    }
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {

    //Build up the GetUserRequest object
    const request: GetUserRequest = {
      authToken: authToken,
      alias: alias,
    };
    
    try {
      //Call the server
      const response = await this.serverFacade.getUser(request);

      if (!response.success) {
        throw new Error(response.message || "Invalid request");
      }

      if (response.user === null) {
        throw new Error(response.message || "User is null");
      }

      return User.fromDto(response.user);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get user due to an unexpected error");
    }
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    // await new Promise((res) => setTimeout(res, 1000));

    //Build up the LogoutRequest object
    const request = new LogoutRequest(authToken);
    //Call the server
    const response = await this.serverFacade.logout(request);

    if (!response.success) {
      throw new Error(response.message || "Invalid logout");
    }

    return;
  }
}
