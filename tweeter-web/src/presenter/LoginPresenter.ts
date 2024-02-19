import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

interface LoginView {
    updateUserInfo: (
        user: User,
        userToUpdate: User,
        authToken: AuthToken,
        rememberMe: boolean
    ) => void;
    displayErrorMessage: (message: string) => void;
    navigate: (path: string) => void;
    
}

export class LoginPresenter {
  private service: UserService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.service = new UserService();
    this.view = view;
  }

  public async doLogin(alias: string, password: string, rememberMeRef: React.MutableRefObject<boolean>, originalUrl?: string) {
    try {
      let [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMeRef.current);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }
}