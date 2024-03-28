import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";
import { AuthTokenDto } from "../dto/AuthTokenDto";
import { StatusDto } from "../dto/StatusDto";
import { UserDto } from "../dto/UserDto";

export interface TweeterRequest {}


/// User service requests ///
export class LoginRequest implements TweeterRequest {
    alias: string;
    password: string;

    constructor(alias: string, password: string) {
        this.alias = alias;
        this.password = password;
    }
}

export class RegisterRequest implements TweeterRequest {
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    imageStringBase64: string;

    constructor(firstName: string, lastName: string, alias: string, password: string, imageStringBase64: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.password = password;
        this.imageStringBase64 = imageStringBase64;
    }
}

export class GetUserRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    alias: string;

    constructor(authtoken: AuthToken, alias: string) {
        this.authToken = authtoken.dto;
        this.alias = alias;
    }
}

export class LogoutRequest implements TweeterRequest {
    authToken: AuthTokenDto;

    constructor(authtoken: AuthToken) {
        this.authToken = authtoken.dto;
    }
}


/// Parent classes for general loading of more items  ///
// LoadMoreFollowersItems, LoadMoreFollowingItems
export class LoadMoreFollowItemsRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    user: UserDto;
    pageSize: number;
    lastItem: UserDto | null;

    constructor(authtoken: AuthToken, user: User, pageSize: number, lastItem: User | null) {
        this.authToken = authtoken.dto;
        this.user = user.dto;
        this.pageSize = pageSize;
        this.lastItem = lastItem ? lastItem.dto: null;
    }
}

export class LoadMoreStatusItemsRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    user: UserDto;
    pageSize: number;
    lastItem: StatusDto | null;

    constructor(authtoken: AuthToken, user: User, pageSize: number, lastItem: Status | null) {
        this.authToken = authtoken.dto;
        this.user = user.dto;
        this.pageSize = pageSize;
        this.lastItem = lastItem ? lastItem.dto : null;
    }

}

/// Follow related Requests ///

// GetIsFollowerStatus
export class GetIsFollowerStatusRequest implements TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
  selectedUser: UserDto;

  constructor(authtoken: AuthToken, user: User, selectedUser: User) {
    this.authToken = authtoken.dto;
    this.user = user.dto;
    this.selectedUser = selectedUser.dto;
  }
}

// GetFollowersCount and GetFolloweesCount
export class GetFollowCountRequest implements TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;

  constructor(authtoken: AuthToken, user: User) {
    this.authToken = authtoken.dto;
    this.user = user.dto;
  }
}

// Follow or Unfollow
export class FollowOrUnFollowRequest implements TweeterRequest {
  authToken: AuthTokenDto;
  userToFollowOrUnFollow: UserDto;

  constructor(authtoken: AuthToken, userToFollowOrUnFollow: User) {
    this.authToken = authtoken.dto;
    this.userToFollowOrUnFollow = userToFollowOrUnFollow.dto;
  }
}

/// Status related Requests ///

// postStatus
export class PostStatusRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    newStatus: StatusDto;

    constructor(authtoken: AuthToken, newStatus: Status) {
        this.authToken = authtoken.dto;
        this.newStatus = newStatus.dto;
    }
}