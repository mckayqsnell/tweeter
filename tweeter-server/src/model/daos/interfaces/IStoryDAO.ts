import { StoryDB } from "../../DatabaseTypes";

export interface IStoryDAO {
  loadMoreStoryItems(
    alias: string,
    pageSize: number,
    lastItemTimestamp: number | undefined
  ): Promise<[StoryDB[], boolean]>;

  postStoryItem(storyDB: StoryDB): Promise<void>;
}
