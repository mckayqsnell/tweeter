import { FeedDB } from "../../DatabaseTypes";

export interface IFeedDAO {
    loadMoreFeedItems(
        alias: string,
        pageSize: number,
        lastItemTimestamp: number | undefined
    ): Promise<[FeedDB[], boolean]>;
    
    postFeedItems(feedDBs: FeedDB[]): Promise<void>;
}