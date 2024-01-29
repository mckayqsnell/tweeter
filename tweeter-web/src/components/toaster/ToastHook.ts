import { useContext } from "react";
import { ToastInfoContext } from "./ToastProvider";

const useToaster = () => useContext(ToastInfoContext);

export default useToaster;
