import { AuthToken } from "tweeter-shared";

export interface AppNavBarView {
    displayErrorMessage: (message: string) => void;
    clearUserInfo: () => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class AppNavBarPresenter {
  private _view: AppNavBarView;

  public constructor(view: AppNavBarView) {
    this._view = view;
  }

  public async logOut(authToken: AuthToken | null) {
    this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logout(authToken!);

      this._view.clearLastInfoMessage();
      this._view.clearUserInfo();
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