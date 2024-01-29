import { Context, createContext, useState } from "react";
import {
  Toast,
  Type,
  makeErrorToast,
  makeInfoToast,
  makeSuccessToast,
  makeWarningToast,
} from "./Toast";

interface ToastInfo {
  toastList: Toast[];
  displaySuccessToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayErrorToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayInfoToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayWarningToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  deleteToast: (id: string) => void;
  deleteAllToasts: () => void;
  deleteAllSuccessToasts: () => void;
  deleteAllErrorToasts: () => void;
  deleteAllInfoToasts: () => void;
  deleteAllWarningToasts: () => void;
  deleteLastToast: () => void;
  deleteLastSuccessToast: () => void;
  deleteLastErrorToast: () => void;
  deleteLastInfoToast: () => void;
  deleteLastWarningToast: () => void;
}

const defaultToastInfo: ToastInfo = {
  toastList: [],
  displaySuccessToast: (message: string, duration: number) => null,
  displayErrorToast: (message: string, duration: number) => null,
  displayInfoToast: (message: string, duration: number) => null,
  displayWarningToast: (message: string, duration: number) => null,
  deleteToast: (toast: string) => null,
  deleteAllToasts: () => null,
  deleteAllSuccessToasts: () => null,
  deleteAllErrorToasts: () => null,
  deleteAllInfoToasts: () => null,
  deleteAllWarningToasts: () => null,
  deleteLastToast: () => null,
  deleteLastSuccessToast: () => null,
  deleteLastErrorToast: () => null,
  deleteLastInfoToast: () => null,
  deleteLastWarningToast: () => null,
};

export const ToastInfoContext: Context<ToastInfo> =
  createContext<ToastInfo>(defaultToastInfo);

interface Props {
  children: React.ReactNode;
}

const ToastProvider: React.FC<Props> = ({ children }) => {
  const [toastInfo, setToastInfo] = useState(defaultToastInfo);

  const displayToast = (toast: Toast) => {
    let { toastList } = toastInfo;
    toastList.push(toast);

    setToastInfo({ ...toastInfo, ...toastList });
  };

  const displaySuccessToast = (
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string => {
    let toast = makeSuccessToast(message, duration, bootstrapClasses);
    displayToast(toast);
    return toast.id;
  };

  const displayErrorToast = (
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string => {
    let toast = makeErrorToast(message, duration, bootstrapClasses);
    displayToast(toast);
    return toast.id;
  };

  const displayInfoToast = (
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string => {
    let toast = makeInfoToast(message, duration, bootstrapClasses);
    displayToast(toast);
    return toast.id;
  };

  const displayWarningToast = (
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string => {
    let toast = makeWarningToast(message, duration, bootstrapClasses);
    displayToast(toast);
    return toast.id;
  };

  const deleteToast = (id: string) => {
    let { toastList } = toastInfo;
    const listItemIndex = toastList.findIndex((x) => x.id === id);

    toastList.splice(listItemIndex, 1);
    setToastInfo({ ...toastInfo, ...toastList });
  };

  const deleteAllToasts = () => {
    setToastInfo({ ...toastInfo, ...{ toastList: [] } });
  };

  const deleteAllSuccessToasts = () => {
    deleteAllToastsOfType(Type.Success);
  };

  const deleteAllErrorToasts = () => {
    deleteAllToastsOfType(Type.Error);
  };

  const deleteAllInfoToasts = () => {
    deleteAllToastsOfType(Type.Info);
  };

  const deleteAllWarningToasts = () => {
    deleteAllToastsOfType(Type.Warning);
  };

  const deleteAllToastsOfType = (type: Type) => {
    for (let toast of toastInfo.toastList) {
      if (toast.type === type) {
        deleteToast(toast.id);
      }
    }
  };

  const deleteLastToast = () => {
    let { toastList } = toastInfo;

    if (!!toastList && toastList.length > 0) {
      deleteToast(toastList[toastList.length - 1].id);
    }
  };

  const deleteLastSuccessToast = () => {
    deleteLastTypedToast(Type.Success);
  };

  const deleteLastErrorToast = () => {
    deleteLastTypedToast(Type.Error);
  };

  const deleteLastInfoToast = () => {
    deleteLastTypedToast(Type.Info);
  };

  const deleteLastWarningToast = () => {
    deleteLastTypedToast(Type.Warning);
  };

  const deleteLastTypedToast = (type: Type) => {
    let { toastList } = toastInfo;

    if (!!toastList && toastList.length > 0) {
      let index = toastList.length - 1;

      do {
        if (toastList[index].type === type) {
          deleteToast(toastList[index].id);
          break;
        }

        index--;
      } while (index >= 0);
    }
  };

  return (
    <ToastInfoContext.Provider
      value={{
        ...toastInfo,
        displaySuccessToast: displaySuccessToast,
        displayErrorToast: displayErrorToast,
        displayInfoToast: displayInfoToast,
        displayWarningToast: displayWarningToast,
        deleteToast: deleteToast,
        deleteAllToasts: deleteAllToasts,
        deleteAllSuccessToasts: deleteAllSuccessToasts,
        deleteAllErrorToasts: deleteAllErrorToasts,
        deleteAllInfoToasts: deleteAllInfoToasts,
        deleteAllWarningToasts: deleteAllWarningToasts,
        deleteLastToast: deleteLastToast,
        deleteLastSuccessToast: deleteLastSuccessToast,
        deleteLastErrorToast: deleteLastErrorToast,
        deleteLastInfoToast: deleteLastInfoToast,
        deleteLastWarningToast: deleteLastWarningToast,
      }}
    >
      {children}
    </ToastInfoContext.Provider>
  );
};

export default ToastProvider;
