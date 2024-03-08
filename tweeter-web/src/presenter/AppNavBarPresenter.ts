import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AppNavBarView extends MessageView {
  clearUserInfo: () => void;
}

export class AppNavBarPresenter extends Presenter {
  private _userService: UserService;

  public constructor(view: AppNavBarView) {
    super(view);
    this._userService = new UserService();
  }

  public get view(): AppNavBarView {
    return super.view as AppNavBarView;
  }

  public get userService(): UserService {
    return this._userService;
  }

  public async logOut(authToken: AuthToken | null) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    
    }, "log user out");
  };
}