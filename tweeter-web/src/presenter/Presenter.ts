import { AuthToken, User } from "tweeter-shared";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export interface AuthView extends View {
  updateUserInfo: (
    user: User,
    userToUpdate: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export class Presenter {
  protected _view: View;

  protected constructor(view: View) {
    this._view = view;
  }

  protected get view(): View {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
      );
    }
  }

  protected async doAuthOperation(
    authFunc: () => Promise<[User, AuthToken]>, 
    updateViewAfterAuth: (
      user: User,
      authToken: AuthToken,
      rememberMe: boolean
    ) => void, 
    navFunc: (path: string) => void,
    rememberMe: boolean,
    path: string
  ) {
    this.doFailureReportingOperation(async () => {
      let [user, authToken] = await authFunc();
      updateViewAfterAuth(user, authToken, rememberMe);
      navFunc(path);
    }, "authenticate user");
  }
}
