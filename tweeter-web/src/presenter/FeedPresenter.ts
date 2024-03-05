import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(
      authToken,
      user,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load feed items";
  }

  public constructor(view: StatusItemView) {
    super(view);
  }
}
