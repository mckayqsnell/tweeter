import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import {
  anyOfClass,
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("token", Date.now());
  const post = "This is a post";
  const currentUser = new User("Bob", "Steve", "bobsteve", "image");
  const status = new Status(post, currentUser!, Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.postStatus(post, currentUser, authToken);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.postStatus(post, currentUser, authToken);

    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();

    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(status.post);
  });

  it("When posting of the status is successful, tells the view to clear the last info message, clear the post, and display a status posted message.", async () => {
    await postStatusPresenter.postStatus(post, currentUser, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });

  it("When posting of the status is not successful, tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the post, and display a status posted message.", async () => {
    when(
      mockStatusService.postStatus(authToken, anyOfClass(Status)) // had to do anyOfClass because of the stupid time stamp in status
    ).thenThrow(new Error("posting status failed"));

    await postStatusPresenter.postStatus(post, currentUser, authToken);

    //   // capture the parameters of the call to displayErrorMessage
    //   let [capturedErrorMessage] = capture(
    //     mockPostStatusView.displayErrorMessage
    //   ).last();

    //   console.log(capturedErrorMessage);

    verify(mockPostStatusView.displayErrorMessage(anything())).once();

    verify(mockPostStatusView.clearLastInfoMessage()).never();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
