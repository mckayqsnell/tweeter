import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

//Make a view interface so that it can talk to the view (observer method)
export const PAGE_SIZE = 10;

export class FollowersPresenter extends UserItemPresenter {
  private service: FollowService;

  public constructor(view: UserItemView) {
    super(view);
    this.service = new FollowService();
  }

  public async loadMoreItems(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      if (this.hasMoreItems) {
        let [newItems, hasMore] = await this.service.loadMoreFollowers(
          authToken,
          user,
          PAGE_SIZE,
          this.lastItem
        );

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    }, "load follower items");
  }
}
