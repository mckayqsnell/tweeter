import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthView, Presenter} from "./Presenter";

export class LoginPresenter extends Presenter {
  private service: UserService;

  public constructor(view: AuthView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): AuthView{
    return super.view as AuthView;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
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

    await this.doAuthOperation(authFunc, updateViewAfterAuth, navFunc, rememberMe, navigationPath);
  }
}
