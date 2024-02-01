import "./AppNavbar.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { AuthToken } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

const AppNavbar = () => {
  const location = useLocation();
  const { authToken, clearUserInfo } = useUserInfo();
  const { displayInfoMessage, displayErrorMessage, clearLastInfoMessage } =
    useToastListener();

  const logOut = async () => {
    displayInfoMessage("Logging Out...", 0);

    try {
      await logout(authToken!);

      clearLastInfoMessage();
      clearUserInfo();
    } catch (error) {
      displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };

  const logout = async (authToken: AuthToken): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"./bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink to="/feed">Feed</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/story">Story</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/following">Following</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/followers">Followers</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink id="logout" onClick={logOut} to={location.pathname}>
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
