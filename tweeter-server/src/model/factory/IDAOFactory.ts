export interface IDAOFactory {
    getStoryDAO(): any;
    getFeedDAO(): any;
    getFollowDAO(): any;
    getAuthTokenDAO(): any;
}