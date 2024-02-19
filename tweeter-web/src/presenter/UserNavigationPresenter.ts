import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private service: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this.service = new UserService();
  }

  public extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
  }

  public async displayUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User) {
    try {
      let alias = this.extractAlias(event.target.toString());

      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._view.setDisplayedUser(currentUser!);
        } else {
          this._view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }
}