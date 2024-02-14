import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
  addItems: (items: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
  private _view: UserItemView;
  private _hasMoreItems: boolean = true;

  protected constructor(view: UserItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  // Abstract methods in typeScript can't be async. The implementation is where you specify that
  public abstract loadMoreItems(
    authToken: AuthToken,
    displayedUser: User
  ): void;
}
