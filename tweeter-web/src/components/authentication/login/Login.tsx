import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useContext } from "react";
import { UserInfoContext } from "../../userInfo/UserInfoProvider";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useContext(UserInfoContext);
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const doLogin = async () => {
    try {
      let [user, authToken] = await login(alias, password);

      updateUserInfo(user, user, authToken, rememberMeRef.current);

      if (!!props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate("/");
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  };

  const login = async (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  const inputFieldGenerator = () => {
    return (
      <>
        {/* Authentication fields for alias and password (same for login) */}
        <AuthenticationFields
          setAlias={(event) => setAlias(event.target.value)}
          setPassword={(event) => setPassword(event.target.value)}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
