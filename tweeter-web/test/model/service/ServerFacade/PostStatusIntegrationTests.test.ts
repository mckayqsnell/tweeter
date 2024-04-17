import { mock, instance, verify} from "ts-mockito";
import { ServerFacade } from "../../../../src/model/service/ServerFacade/ServerFacade";
import {PostStatusPresenter, PostStatusView} from "../../../../src/presenter/PostStatusPresenter";
import { User, AuthToken, LoginRequest, AuthenticateResponse, LoadMoreStatusItemsRequest } from "tweeter-shared";
import "isomorphic-fetch";


describe("PostStatusPresenter Integration Test", () => {
  let presenter: PostStatusPresenter;
  let mockView: PostStatusView;
  let serverFacade: ServerFacade;
  let user: User;
  const alias = "@test2";
  const password = "password";
  let statusText: string;

  beforeEach(() => {
    // Mock only the view
    mockView = mock<PostStatusView>();
    const viewInstance = instance(mockView);

    // Using actual ServerFacade
    serverFacade = new ServerFacade();

    // Instantiate the presenter with the actual ServerFacade and the mocked view
    presenter = new PostStatusPresenter(viewInstance);

    user = new User(
      "test",
      "testLastName",
      alias,
      "https://340tweeteruserimages.s3.us-west-2.amazonaws.com/image/@test2profileImage"
    );
    statusText = "Hello, world!";
  });

  it("should post a status and verify it is appended to the user's story", async () => {
    // Step 1: Login user
    const loginResponse = await serverFacade.login(
      new LoginRequest(alias, password)
    );
    expect(loginResponse.token).toBeDefined(); // Ensure login was successful
    expect(loginResponse.user).toBeDefined(); // Ensure user was returned
    // verify the firstname and lastname are correct
    expect(loginResponse.user?.alias).toEqual(alias);
    expect(loginResponse.user?.firstName).toEqual("test");
    expect(loginResponse.user?.lastName).toEqual("testLastName");
    expect(loginResponse.user?.imageUrl).toEqual(
      "https://340tweeteruserimages.s3.us-west-2.amazonaws.com/image/@test2profileImage"
    );

    const authtokenfromLogin = AuthToken.fromDto(loginResponse.token!)!;
    console.log("authtokenfromLogin: ", authtokenfromLogin);
    // Step 2: Post status
    await presenter.postStatus(statusText, user, authtokenfromLogin);

    // Verify the view displayed the correct success message
    verify(mockView.displayInfoMessage("Posting status...", 0)).once();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockView.setPost("")).once(); // Ensure the post box was cleared

    // Step 3: Retrieve the user's story to verify the status was appended
    const loadMoreResponse = await serverFacade.loadMoreStoryItems(
      new LoadMoreStatusItemsRequest(authtokenfromLogin, user, 10, null)
    );
    expect(loadMoreResponse.statusItems).toContainEqual(
      expect.objectContaining({
        post: statusText,
      })
    );
  }, 15000);
});
