import { AuthToken, AuthTokenDto, FakeData, User } from "tweeter-shared";

export class UserService {
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with result of calling to the database
    let user = FakeData.instance.firstUser;

    if (!user) {
      throw new Error(`[Bad Request] user login failed for ${alias}`);
    }
    // TODO: have this return a messgae from the DAO as well(incorrect password, user not found, etc.)

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

    if (!user) {
      throw new Error(`[Bad Request] user registration failed for ${alias}`);
    }
    // TODO: have this return the message from the DAO (duplicate user, etc.)

    return [user, FakeData.instance.authToken];
  }

  public async getUser(
    authTokenDto: AuthTokenDto,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling database
    const authToken = AuthToken.fromDto(authTokenDto);

    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }

    const user = FakeData.instance.findUserByAlias(alias);

    if (!user) {
      throw new Error(`[Bad Request] requested user ${alias} does not exist`);
    }

    return user;
  }

  public async logout(authTokenDto: AuthTokenDto): Promise<void> {
    // TODO: Replace with the result of calling database
    const authToken = AuthToken.fromDto(authTokenDto);
    if (!authToken) {
      throw new Error("[AuthError] unauthenticated request");
    }
  }

  // TODO: Implement actual logout logic, such as invalidating the authToken in the database
}
