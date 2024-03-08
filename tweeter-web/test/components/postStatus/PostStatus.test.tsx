import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";
import { instance, mock, verify } from "ts-mockito";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus component", () => {
  const mockUserInstance = instance(mock<User>());
  const mockAuthTokenInstance = instance(mock<AuthToken>());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("When first rendered the Post Status and Clear buttons are both disabled.", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text.", async () => {
    const { postStatusButton, clearButton, postTextArea } =
      renderPostStatusAndGetElements();

    await userEvent.type(postTextArea, "test");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { postStatusButton, clearButton, postTextArea } =
      renderPostStatusAndGetElements();

    await userEvent.type(postTextArea, "test");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await userEvent.clear(postTextArea);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, postTextArea } = renderPostStatusAndGetElements(
      mockPresenterInstance
    );

    await userEvent.type(postTextArea, "test");
    await userEvent.click(postStatusButton);

    verify(
      mockPresenter.postStatus("test", mockUserInstance, mockAuthTokenInstance)
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /post status/i });
  const clearButton = screen.getByRole("button", { name: /clear status/i });
  const postTextArea = screen.getByPlaceholderText(/What's on your mind?/i);

  return { postStatusButton, clearButton, postTextArea, user };
};
