import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { IAuthTokenDAO } from "../daos/interfaces/IAuthTokenDAO";
import { IDAOFactory } from "../factory/IDAOFactory";
import { AuthTokenDB } from "../DatabaseTypes";

export class AuthService {
  private AuthTokenDAO: IAuthTokenDAO;

  constructor(factory: IDAOFactory) {
    this.AuthTokenDAO = factory.getAuthTokenDAO();
  }

  public createAuthToken = async (alias: string): Promise<AuthTokenDto> => {
    const authToken = AuthToken.Generate();
    const authTokenDb = this.makeAuthTokenDb(authToken, alias);

    try {
      await this.AuthTokenDAO.storeToken(authTokenDb);
      return authToken.dto;
    } catch (error) {
      throw new Error(
        `[Internal Server Error] Failed to store AuthToken in the database: ${error}`
      );
    }
  }

  public deleteAuthToken = async (authToken: AuthTokenDto): Promise<void> => {
    try {
      console.log(`Deleting token ${authToken.token} in AuthService`)
      await this.AuthTokenDAO.deleteToken(authToken.token);
    } catch (error) {
      throw new Error(
        `[Internal Server Error] Failed to delete AuthToken in the database: ${error}`
      );
    }
  }

  public async validateAuthToken(authToken: AuthTokenDto): Promise<boolean> {
    if(!authToken) {
      console.error(`Token is undefined or null in validateAuthToken in AuthService`);
      return false;
    }
    
    try {
      const authTokenfromDb = await this.AuthTokenDAO.getToken(authToken.token);
      console.log(`Validating token ${authTokenfromDb} from the database`)
      if(!authTokenfromDb) {
        console.log(`Token ${authToken.token} not found in the database`)
      } else {
        console.log(`Token ${authToken.token} found in the database`)
      }

      // check if this authToken is expired
      if (authTokenfromDb.expiretime < Date.now()) {
        console.log(`Token ${authToken.token} has expired`)
        // delete the expired token
        await this.AuthTokenDAO.deleteToken(authToken.token);
        return false;
      }

      return authTokenfromDb !== null
    } catch (error) {
        console.error(`Error validating token ${authToken.token} from the database: ${error}`);
      return false;
    }
  }

  public getAlias = async (authToken: AuthTokenDto): Promise<string> => {
    try {
      const authTokenfromDb = await this.AuthTokenDAO.getToken(authToken.token);
      return authTokenfromDb.alias;
    } catch (error) {
      throw new Error(
        `[Internal Server Error] Failed to get alias from the database: ${error}`
      );
    }
  }

  private makeAuthTokenDb = (authToken: AuthTokenDto, alias: string): AuthTokenDB => {
    return {
      token: authToken.token,
      expiretime: authToken.timestamp + 24 * 60 * 60 * 1000, // convert timestamp to expire time by adding 24 hours
      alias: alias,
    };
  }
}
