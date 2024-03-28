import { AuthToken, AuthTokenDto, FakeData, User } from "tweeter-shared";

export class UserService {
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with result of calling to the database
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with result of calling to the database
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async getUser(
    authTokenDto: AuthTokenDto,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling database
    const authToken = AuthToken.fromDto(authTokenDto);
    return FakeData.instance.findUserByAlias(alias);
  }

  public async logout(authTokenDto: AuthTokenDto): Promise<void> {
    // TODO: Replace with the result of calling database
    const authToken = AuthToken.fromDto(authTokenDto);
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}