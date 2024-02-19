import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { UserInfoPresenter, UserInfoView } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  const listener: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    setUserInfo: setDisplayedUser,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
  }

  const [presenter] = useState(new UserInfoPresenter(listener));

  // this affects how the UI is displayed so leaving it here
  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    presenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    presenter.setNumbFollowees(authToken!, displayedUser!);
    presenter.setNumbFollowers(authToken!, displayedUser!);
  });

  // leave this here because it is a UI function
  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    await presenter.followUser(displayedUser!, authToken!);
  };


  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    await presenter.unfollowUser(displayedUser!, authToken!);
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {presenter.followeesCount > -1 && presenter.followersCount > -1 && (
                <div>
                  Following: {presenter.followeesCount} Followers: {presenter.followersCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {presenter.isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
