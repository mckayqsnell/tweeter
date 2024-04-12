export interface UserDB {
  alias: string;
  firstName: string;
  imageUrl: string;
  lastName: string;
  password: string;
  followersCount: number;
  followeesCount: number;
}

export interface AuthTokenDB {
  token: string;
  alias: string;
  expiretime: number;
}

export interface FollowDB {
  followee_handle: string;
  follower_handle: string;

  followeeFirstName: string;
  followeeLastName: string;
  followeeAlias: string;
  followeeImageUrl: string;

  followerFirstName: string;
  followerLastName: string;
  followerAlias: string;
  followerImageUrl: string;
}
