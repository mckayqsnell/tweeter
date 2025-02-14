import { AuthToken } from "../domain/AuthToken";
import { PostSegment } from "../domain/PostSegment";
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

  constructor(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ) {
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

  public static fromJSON(json: any): GetUserRequest {
    let authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );

    return new GetUserRequest(authToken, json.alias);
  }
}

export class LogoutRequest implements TweeterRequest {
  authToken: AuthTokenDto;

  constructor(authtoken: AuthToken) {
    this.authToken = authtoken.dto;
  }

  public static fromJSON(json: any): LogoutRequest {
    let authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );

    return new LogoutRequest(authToken);
  }
}

/// Parent classes for general loading of more items  ///
// LoadMoreFollowersItems, LoadMoreFollowingItems
export class LoadMoreFollowItemsRequest implements TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
  pageSize: number;
  lastItem: UserDto | null;

  constructor(
    authtoken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ) {
    this.authToken = authtoken.dto;
    this.user = user.dto;
    this.pageSize = pageSize;
    this.lastItem = lastItem ? lastItem.dto : null;
  }

  public static fromJSON(json: any): LoadMoreFollowItemsRequest {
    let authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );
    let user = new User(
      json.user._firstName,
      json.user._lastName,
      json.user._alias,
      json.user._imageUrl
    );

    let lastItem = null;

    if (json.lastItem) {
      lastItem = new User(
        json.lastItem._firstName,
        json.lastItem._lastName,
        json.lastItem._alias,
        json.lastItem._imageUrl
      );
    }

    return new LoadMoreFollowItemsRequest(
      authToken,
      user,
      json.pageSize,
      lastItem
    );
  }
}

export class LoadMoreStatusItemsRequest implements TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
  pageSize: number;
  lastItem: StatusDto | null;

  constructor(
    authtoken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ) {
    this.authToken = authtoken.dto;
    this.user = user.dto;
    this.pageSize = pageSize;
    this.lastItem = lastItem ? lastItem.dto : null;
  }

  public static fromJSON(json: any): LoadMoreStatusItemsRequest {
    // Handle both underscore and camelCase formats for authToken and user
    let authTokenJson = json.authToken || json._authToken || {};
    let userJson = json.user || json._user || {};
    let lastItemJson = json.lastItem || json._lastItem || null;

    let authToken = new AuthToken(
      authTokenJson.token || authTokenJson._token,
      authTokenJson.timestamp || authTokenJson._timestamp
    );
    let user = new User(
      userJson.firstName || userJson._firstName,
      userJson.lastName || userJson._lastName,
      userJson.alias || userJson._alias,
      userJson.imageUrl || userJson._imageUrl
    );

    let lastItem = null;
    if (lastItemJson) {
      let lastItemUser = new User(
        lastItemJson.user?._firstName || lastItemJson._user?._firstName,
        lastItemJson.user?._lastName || lastItemJson._user?._lastName,
        lastItemJson.user?._alias || lastItemJson._user?._alias,
        lastItemJson.user?._imageUrl || lastItemJson._user?._imageUrl
      );
      lastItem = new Status(
        lastItemJson.post || lastItemJson._post,
        lastItemUser,
        lastItemJson.timestamp || lastItemJson._timestamp
      );
    }

    return new LoadMoreStatusItemsRequest(
      authToken,
      user,
      json.pageSize || json._pageSize,
      lastItem
    );
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

  public static fromJSON(json: any): GetIsFollowerStatusRequest {
    const authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );

    const user = new User(
      json.user._firstName,
      json.user._lastName,
      json.user._alias,
      json.user._imageUrl
    );

    const selectedUser = new User(
      json.selectedUser._firstName,
      json.selectedUser._lastName,
      json.selectedUser._alias,
      json.selectedUser._imageUrl
    );

    return new GetIsFollowerStatusRequest(authToken, user, selectedUser);
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

  public static fromJSON(json: any): GetFollowCountRequest {
    const authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );

    const user = new User(
      json.user._firstName,
      json.user._lastName,
      json.user._alias,
      json.user._imageUrl
    );

    return new GetFollowCountRequest(authToken, user);
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

  public static fromJSON(json: any): FollowOrUnFollowRequest {
    const authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );

    const userToFollowOrUnFollow = new User(
      json.userToFollowOrUnFollow._firstName,
      json.userToFollowOrUnFollow._lastName,
      json.userToFollowOrUnFollow._alias,
      json.userToFollowOrUnFollow._imageUrl
    );

    return new FollowOrUnFollowRequest(authToken, userToFollowOrUnFollow);
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

  public static fromJSON(json: any): PostStatusRequest {
    const authToken = new AuthToken(
      json.authToken._token,
      json.authToken._timestamp
    );

    const user = new User(
      json.newStatus._user._firstName,
      json.newStatus._user._lastName,
      json.newStatus._user._alias,
      json.newStatus._user._imageUrl
    );

    const newStatus = new Status(
      json.newStatus._post,
      user,
      json.newStatus._timestamp
    );

    return new PostStatusRequest(authToken, newStatus);
  }
}
