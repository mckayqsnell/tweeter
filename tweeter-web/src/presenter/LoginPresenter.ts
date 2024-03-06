import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

interface LoginView extends View {
  updateUserInfo: (
    user: User,
    userToUpdate: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter {
  private service: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): LoginView {
    return super.view as LoginView;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMeRef: React.MutableRefObject<boolean>,
    originalUrl?: string
  ) {
    const authFunc = () => this.service.login(alias, password);
    const updateViewAfterAuth = (
      user: User,
      authToken: AuthToken,
      rememberMe: boolean
    ) => this.view.updateUserInfo(user, user, authToken, rememberMe);
    const navFunc = (path: string) => this.view.navigate(path);
    
    const navigationPath = originalUrl ? originalUrl : "/";

    await this.doAuthOperation(authFunc, updateViewAfterAuth, navFunc, rememberMeRef.current, navigationPath);
  }
}
