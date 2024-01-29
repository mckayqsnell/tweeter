import useToaster from "./ToastHook";

interface ToastListener {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  clearLastInfoMessage: () => void;
}

const useToastListener = (): ToastListener => {
  const { displayInfoToast, displayErrorToast, deleteLastInfoToast } =
    useToaster();

  return {
    displayInfoMessage: displayInfoToast,
    displayErrorMessage: (message: string, bootstrapClasses?: string) =>
      displayErrorToast(message, 0, bootstrapClasses),
    clearLastInfoMessage: deleteLastInfoToast,
  };
};

export default useToastListener;
