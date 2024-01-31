import { AuthToken, FakeData, User } from "tweeter-shared";
import useUserInfo from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>; // Returning a promise indicates that is an async function
}

const useUserNavigation = (): UserNavigation => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo(); // hook that I made to abstract the user context
  const { displayErrorMessage } = useToastListener();

  /* Function definitions for what we are about to return in the UserNavigation Object. */

  const navigateToUser: UserNavigation["navigateToUser"] = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      let alias = extractAlias(event.target.toString());

      let user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  // now that we have defined the functions, we can return them in the UserNavigation object
  return {
    navigateToUser: navigateToUser,
  };
};

export default useUserNavigation;
