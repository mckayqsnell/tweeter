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

// the posts from all the users the user is following
export interface FeedDB {
  reciever_alias: string; // partition key // whos feed it is who is recieving the posts
  timestamp: number; // sort key
  sender_alias: string;
  sender_firstName: string;
  sender_lastName: string;
  sender_imageUrl: string;
  post: string; //post segments are generated by the post
}

// everything the user has posted
export interface StoryDB {
  sender_alias: string; // partition key // the person who posted the status
  timestamp: number; // sort key
  sender_firstName: string;
  sender_lastName: string;
  sender_imageUrl: string;
  post: string; //post segments are generated by the post
}
