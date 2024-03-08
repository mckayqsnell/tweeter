import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login component", () => {
  it("When first rendered the sign in button is disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");

    expect(signInButton).toBeDisabled();
  });

  it("The sign in button is enabled if both alias and password fileds have text", async () => {
    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/");

    await userEvent.type(aliasField, "test");
    await userEvent.type(passwordField, "test");

    expect(signInButton).toBeEnabled();
  });

  it("if either field is cleared, the sign in button is disabled", async () => {
    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/");

    await userEvent.type(aliasField, "test");
    await userEvent.type(passwordField, "test");

    expect(signInButton).toBeEnabled();

    await userEvent.clear(aliasField);

    expect(signInButton).toBeDisabled();

    await userEvent.type(aliasField, "test");
    await userEvent.clear(passwordField);

    expect(signInButton).toBeDisabled();
  });

  it(" calls the presenters login method with correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "@test";
    const password = "test";

    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await userEvent.type(aliasField, alias);
    await userEvent.type(passwordField, password);

    await userEvent.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  //const rememberMeCheckbox = screen.getByLabelText("rememberMeCheckbox");

  return { signInButton, aliasField, passwordField, user };
};
