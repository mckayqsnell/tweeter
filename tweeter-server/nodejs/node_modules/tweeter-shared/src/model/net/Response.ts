import { AuthTokenDto } from "../dto/AuthTokenDto";
import { StatusDto } from "../dto/StatusDto";
import { UserDto } from "../dto/UserDto";
export interface TweeterResponse {
  readonly success: boolean;
  readonly message: string | undefined;
}

//////////////////////////////
/// User related Responses ///
//////////////////////////////

export interface AuthenticateResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly token: AuthTokenDto | null;
}

export interface GetUserReponse extends TweeterResponse {
  readonly user: UserDto | null;
}

export interface LogoutResponse extends TweeterResponse {
}

////////////////////////////////
/// Follow related responses ///
////////////////////////////////

// LoadMoreFollowers and LoadMoreFollowees
export interface LoadMoreFollowItemsResponse extends TweeterResponse {
  users : UserDto[];
  hasMorePages: boolean;
}

// GetIsFollowerStatus
export interface GetIsFollowerStatusResponse extends TweeterResponse {
  isFollower: boolean;
}

// GetFollowCount: GetFollowersCount and GetFolloweesCount
export interface GetFollowCountResponse extends TweeterResponse {
  count: number;
}

// Follow or Unfollow
export interface FollowOrUnFollowResponse extends TweeterResponse {
  followersCount: number;
  followeesCount: number;
}

////////////////////////////////
/// Status related Responses ///
////////////////////////////////

// LoadMoreStatusItems: loadMoreStoryItems and loadMoreFeedItems
export interface LoadMoreStatusItemsResponse extends TweeterResponse {
  statusItems: StatusDto[];
  hasMorePages: boolean;
}

export interface PostStatusResponse extends TweeterResponse {
}
