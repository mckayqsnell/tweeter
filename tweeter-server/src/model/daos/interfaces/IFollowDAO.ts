import { UserDto } from "tweeter-shared";
import { FollowDB, UserDB } from "../../DatabaseTypes";

export interface IFollowDAO {
  
  getPageOfFollowees(
    followerHandler: string,
    pageSize: number,
    lastFolloweeHandle?: string
  ): Promise<[FollowDB[], boolean]>;

  getPageOfFollowers(
    followeeHandler: string,
    pageSize: number,
    lastFollowerHandle?: string
  ): Promise<[FollowDB[], boolean]>;

  follow(userRequestingToFollow: UserDB, userToFollow: UserDB): Promise<void>;

  unfollow(userRequestingToUnfollow: UserDB, userToUnfollow: UserDB): Promise<void>;

  getIsFollowerStatus(user: UserDB, selectedUser: UserDB): Promise<boolean>;
}