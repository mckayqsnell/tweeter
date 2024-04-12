export interface IDAOFactory {
  getUserDAO(): any;
  getStoryDAO(): any;
  getFeedDAO(): any;
  getFollowDAO(): any;
  getAuthTokenDAO(): any;
  getS3StorageDAO(): any;
}