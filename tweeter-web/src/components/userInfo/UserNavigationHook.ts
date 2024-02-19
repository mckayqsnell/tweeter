import useUserInfo from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>; // Returning a promise indicates that is an async function
}

const useUserNavigation = (): UserNavigation => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo(); // hook that I made to abstract the user context
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  }
  // don't need to use useState here because we are in a hook not a component
  const presenter = new UserNavigationPresenter(listener);

  /* Function definitions for what we are about to return in the UserNavigation Object. */

  const navigateToUser: UserNavigation["navigateToUser"] = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault(); //don't do the default HTTP request, do my code

    await presenter.displayUser(event, authToken!, currentUser!);
  };

  // now that we have defined the functions, we can return them in the UserNavigation object
  return {
    navigateToUser: navigateToUser,
  };
};

export default useUserNavigation;