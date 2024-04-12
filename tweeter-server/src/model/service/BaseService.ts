import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthTokenDB, UserDB } from "../DatabaseTypes";
import { IDAOFactory } from "../factory/IDAOFactory";
import { AuthService } from "./AuthService";

export abstract class BaseService {
  protected _daoFactory: IDAOFactory;
  protected _authService: AuthService;

  public constructor(daoFactory: IDAOFactory, authService: AuthService) {
    this._daoFactory = daoFactory;
    this._authService = authService;
  }

  public get daoFactory(): IDAOFactory {
    return this._daoFactory;
  }

  public get authService(): AuthService {
    return this._authService;
  }

  public makeUserDto = (userDb: UserDB): UserDto => {
    return {
      firstName: userDb.firstName,
      lastName: userDb.lastName,
      alias: userDb.alias,
      imageUrl: userDb.imageUrl,
    };
  }

  public makeAuthTokenDto = (authTokenDb: AuthTokenDB): AuthTokenDto => {
    return {
      token: authTokenDb.token,
      timestamp: authTokenDb.expiretime - 24 * 60 * 60 * 1000, // convert expire time to timestamp (creation) by subtracting 24 hours
    };
  }

  public validateAuthToken = async (authTokenDto: AuthTokenDto): Promise<void> => {
    console.log("[BaseService] validateAuthToken")
    if(!authTokenDto) {
      throw new Error("[AuthError] Token is undefined or null in validateAuthToken in BaseService");
    }
    
    try {
      const validate = await this.authService.validateAuthToken(authTokenDto);
      if (!validate) {
        throw new Error("[AuthError] Invalid auth token");
      }
    } catch (error) {
      throw new Error("[AuthError] error validating auth token");
    }
  }

  public validateRequiredFields = (fields: any[]): void => {
  for (const field of fields) {
    if (!field) {
      throw new Error("[Bad Request] missing required fields");
    }
  }
}
}
