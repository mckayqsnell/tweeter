import { AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { RegisterRequest } from "tweeter-shared/dist/model/net/Request";

export class RegisterLambda {
  static async handler(event: RegisterRequest): Promise<AuthenticateResponse> {
    const [user, token] = await new UserService().register(
      event.firstName,
      event.lastName,
      event.alias,
      event.password,
      event.imageStringBase64
    );

    let response: AuthenticateResponse = {
      success: true,
      message: "Login successful",
      user: user ? user.dto : null,
      token: token ? token.dto : null,
    };

    return response;
  }
}
