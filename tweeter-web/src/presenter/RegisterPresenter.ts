import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";

export interface RegisterView {
  updateUserInfo: (
    user: User,
    userToUpdate: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  navigate: (path: string) => void;
  setImageUrl: (url: string) => void;
}

export class RegisterPresenter {
  private serivce: UserService;
  private view: RegisterView;
  private _imageBytes: Uint8Array = new Uint8Array();

  public constructor(view: RegisterView) {
    this.serivce = new UserService();
    this.view = view;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMeRef: React.MutableRefObject<boolean>
  ) {
    try {
      let [user, authToken] = await this.serivce.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInfo(user, user, authToken, rememberMeRef.current);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  }

  public get imageBytes(): Uint8Array {
    return this._imageBytes;
  }

  public set imageBytes(value: Uint8Array) {
    this._imageBytes = value;
  }
}
