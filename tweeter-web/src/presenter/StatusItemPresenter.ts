import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter {
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    super(view);
  }

  protected get view(): StatusItemView {
    return super.view as StatusItemView;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  // the implemtation of this method is where you say its async
  public abstract loadMoreItems(
    authToken: AuthToken,
    displayedUser: User
  ): void;
}
