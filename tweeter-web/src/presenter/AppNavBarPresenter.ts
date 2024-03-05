import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavBarView extends MessageView {
    clearUserInfo: () => void;
}

export class AppNavBarPresenter extends Presenter {

  public constructor(view: AppNavBarView) {
    super(view);
  }

  protected get view(): AppNavBarView {
    return super.view as AppNavBarView;
  }

  public async logOut(authToken: AuthToken | null) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };

  public async logout (authToken: AuthToken) {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}