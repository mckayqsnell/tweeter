import {
  AuthTokenDto,
  User,
  UserDto,
} from "tweeter-shared";
import { IDAOFactory } from "../factory/IDAOFactory";
import { IUserDAO } from "../daos/interfaces/IUserDAO";
import { IS3StorageDAO } from "../daos/interfaces/IS3StorageDAO";
import { AuthService } from "./AuthService";
import { BaseService } from "./BaseService";
import bcrypt from "bcryptjs";

export class UserService extends BaseService {
  private userDAO: IUserDAO;
  private s3StorageDAO: IS3StorageDAO;

  constructor(factory: IDAOFactory, authService: AuthService) {
    super(factory, authService);
    this.userDAO = factory.getUserDAO();
    this.s3StorageDAO = factory.getS3StorageDAO();
  }

  public login = async (
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> => {
    this.validateRequiredFields([alias, password]);

    try {
      const userdb = await this.userDAO.login(alias, password);

      if (!userdb) {
        throw new Error(`[Bad Request] requested user ${alias} does not exist`);
      }

      //verify password
      const isMatch = await bcrypt.compare(password, userdb.password);
      if (!isMatch) {
        throw new Error(`[AuthError] incorrect password`);
      }

      // Construct a userDTO
      const userDto: UserDto = {
        firstName: userdb.firstName,
        lastName: userdb.lastName,
        alias: userdb.alias,
        imageUrl: userdb.imageUrl,
      };

      // store the AuthToken in the database
      const authTokenDto = await this.authService.createAuthToken(alias);

      return [userDto, authTokenDto];
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to login user ${alias}: ${error}`
      );
    }
  }

  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string
  ): Promise<[UserDto, AuthTokenDto]> => {
    this.validateRequiredFields([ firstName, lastName, alias, password, userImageBase64 ]);
    // Send the userImageBase64 to the S3StorageDAO to store the image and get the URL
    try {
      // Store the image in S3 and get the URL
      const imageUrl = await this.s3StorageDAO.putImage(
        `${alias}profileImage`,
        userImageBase64
      );

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await this.userDAO.register(
        firstName,
        lastName,
        alias,
        hashedPassword,
        imageUrl
      );

      // Construct a userDTO
      const userDto: UserDto = {
        firstName: firstName,
        lastName: lastName,
        alias: alias,
        imageUrl: imageUrl,
      };
      // store the AuthToken in the database
      const authTokenDto = await this.authService.createAuthToken(alias);

      return [userDto, authTokenDto];
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to register user ${alias}: ${error}`
      );
    }
  }

  public getUser = async (
    authTokenDto: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> => {
    this.validateRequiredFields([authTokenDto, alias]);

    try {
      const success = await this.authService.validateAuthToken(authTokenDto);
      if (!success) {
        throw new Error("[AuthError] unauthenticated request");
      }

      const userdb = await this.userDAO.getUser(alias);
      if (!userdb) {
        throw new Error(`[Bad Request] requested user ${alias} does not exist`);
      }

      const userDto = this.makeUserDto(userdb);

      return userDto;

    } catch (error) {
      throw new Error(`[AuthError] ${error}`);
    }
  }

  public logout = async (authTokenDto: AuthTokenDto): Promise<void> => {
    this.validateRequiredFields([authTokenDto]);

    try {
      await this.authService.deleteAuthToken(authTokenDto);
    } catch (error) {
      console.error(error);
      throw new Error(
        `[Internal Server Error] failed to logout user: ${error}`
      );
    }
  }
}
