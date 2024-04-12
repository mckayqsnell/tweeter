import { UserDB } from "../../DatabaseTypes";

export interface IUserDAO {
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<void>;

  login(alias: string, password: string): Promise<UserDB>;

  getUser(alias: string): Promise<UserDB>;

  incrementFollowersCount(alias: string): Promise<void>;

  decrementFollowersCount(alias: string): Promise<void>;

  incrementFolloweesCount(alias: string): Promise<void>;

  decrementFolloweesCount(alias: string): Promise<void>;
}
