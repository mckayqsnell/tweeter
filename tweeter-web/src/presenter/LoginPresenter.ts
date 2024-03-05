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
    this.doFailureReportingOperation(async () => {
      let [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMeRef.current);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
  }
}
