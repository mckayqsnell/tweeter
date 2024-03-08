import { AuthToken } from "tweeter-shared";
import {
  AppNavBarPresenter,
  AppNavBarView,
} from "../../src/presenter/AppNavBarPresenter";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let appNavBarPresenter: AppNavBarPresenter;
  let mockAppNavBarView: AppNavBarView;
  let mockUserService: UserService;

  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockAppNavBarView = mock<AppNavBarView>();
    const mockAppNavBarViewInstance = instance(mockAppNavBarView);

    const appNavBarPresenterSpy = spy(
      new AppNavBarPresenter(mockAppNavBarViewInstance)
    );
    appNavBarPresenter = instance(appNavBarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavBarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view do display a logging out message", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavBarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();

    // Another way to verify the call withthe correct parameters
    // let [capturedAuthToken] = capture(mockUserService.logout).last(); // capturing parameters
    // expect(capturedAuthToken).toEqual(authToken);
  });

  it("When the logout is successful, tells the view to clear the last info message, clear the user info, and navigate to the login page", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavBarView.clearLastInfoMessage()).once();
    verify(mockAppNavBarView.clearUserInfo()).once();
    // Navigate doesn't exist in the new version of the code
    verify(mockAppNavBarView.displayErrorMessage(anything())).never();
  });

  it("When the logout is unsuccesful displays an error message and does not clear the last info message, clear the user info, and navigate to the login page", async () => {
    when(mockUserService.logout(authToken)).thenThrow(
      new Error("Logout failed")
    );

    await appNavBarPresenter.logOut(authToken);

    verify(
      mockAppNavBarView.displayErrorMessage(
        "Failed to log user out because of exception: Logout failed"
      )
    ).once();
    verify(mockAppNavBarView.clearLastInfoMessage()).never();
    verify(mockAppNavBarView.clearUserInfo()).never();
    // navigate doesn't exist in the new version of the code
  });
});
