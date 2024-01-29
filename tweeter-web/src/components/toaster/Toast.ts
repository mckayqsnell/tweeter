import { v4 as uuid } from "uuid";

const SUCCESS_TOAST_TITLE: string = "Success";
const ERROR_TOAST_TITLE: string = "Error";
const INFO_TOAST_TITLE: string = "Info";
const WARNING_TOAST_TITLE: string = "Warning";

export enum Type {
  Success,
  Error,
  Info,
  Warning,
  Other,
}

export interface Toast {
  id: string;
  title: string;
  text: string;
  type: Type;
  expirationMillisecond: number;
  bootstrapClasses: string;
}

export const makeToast = (
  title: string,
  text: string,
  type: Type,
  deleteAfterMillis: number,
  bootstrapClasses: string = ""
): Toast => {
  return {
    id: uuid.toString(),
    title: title,
    text: text,
    type: type,
    expirationMillisecond:
      deleteAfterMillis > 0 ? Date.now() + deleteAfterMillis : 0,
    bootstrapClasses: bootstrapClasses,
  };
};

export const makeSuccessToast = (
  text: string,
  deleteAfterMillis: number,
  bootstrapClasses: string = ""
): Toast => {
  return makeToast(
    SUCCESS_TOAST_TITLE,
    text,
    Type.Success,
    deleteAfterMillis,
    bootstrapClasses
  );
};

export const makeErrorToast = (
  text: string,
  deleteAfterMillis: number,
  bootstrapClasses: string = ""
): Toast => {
  return makeToast(
    ERROR_TOAST_TITLE,
    text,
    Type.Error,
    deleteAfterMillis,
    bootstrapClasses
  );
};

export const makeInfoToast = (
  text: string,
  deleteAfterMillis: number,
  bootstrapClasses: string = ""
): Toast => {
  return makeToast(
    INFO_TOAST_TITLE,
    text,
    Type.Info,
    deleteAfterMillis,
    bootstrapClasses
  );
};

export const makeWarningToast = (
  text: string,
  deleteAfterMillis: number,
  bootstrapClasses: string = ""
): Toast => {
  return makeToast(
    WARNING_TOAST_TITLE,
    text,
    Type.Warning,
    deleteAfterMillis,
    bootstrapClasses
  );
};
