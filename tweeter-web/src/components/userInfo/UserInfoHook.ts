import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const useUserInfo = () => useContext(UserInfoContext);

export default useUserInfo;
