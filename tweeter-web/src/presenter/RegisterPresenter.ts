import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { AuthView, Presenter, View } from "./Presenter";

export interface RegisterView extends AuthView {
  setImageUrl: (url: string) => void;
}

export class RegisterPresenter extends Presenter {
  private serivce: UserService;
  private _imageBytes: Uint8Array = new Uint8Array();

  public constructor(view: RegisterView) {
    super(view);
    this.serivce = new UserService();
  }

  protected get view(): RegisterView {
    return super.view as RegisterView;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMeRef: React.MutableRefObject<boolean>
  ) {
    const authFunc = () =>
      this.serivce.register(firstName, lastName, alias, password, imageBytes);
    const updateViewAfterAuth = (
      user: User,
      authToken: AuthToken,
      rememberMe: boolean
    ) => this.view.updateUserInfo(user, user, authToken, rememberMe);
    const navFunc = (path: string) => this.view.navigate(path);

    await this.doAuthOperation(
      authFunc,
      updateViewAfterAuth,
      navFunc,
      rememberMeRef.current,
      "/"
    );
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
