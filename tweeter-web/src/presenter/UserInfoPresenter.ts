import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  setUserInfo: (user: User) => void;
  displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
  private service: FollowService;
  private view: UserInfoView;
  private _isFollower: boolean = false;
  private _followeesCount: number = -1;
  private _followersCount: number = -1;

  public constructor(view: UserInfoView) {
    this.service = new FollowService();
    this.view = view;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.service.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.followeesCount = await this.service.getFolloweesCount(
        authToken,
        displayedUser
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.followersCount = await this.service.getFollowersCount(
        authToken,
        displayedUser
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followUser(displayedUser: User, authToken: AuthToken) {
    try {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.isFollower = true;
      this.followersCount = followersCount;
      this.followeesCount = followeesCount;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    }
  }

  public async unfollowUser(displayedUser: User, authToken: AuthToken) {
    try {
      this.view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.isFollower = false;
      this.followersCount = followersCount;
      this.followeesCount = followeesCount;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    }
  }

  public get isFollower(): boolean {
    return this._isFollower;
  }

  public set isFollower(value: boolean) {
    this._isFollower = value;
  }

  public get followeesCount(): number {
    return this._followeesCount;
  }

  public set followeesCount(value: number) {
    this._followeesCount = value;
  }

  public get followersCount(): number {
    return this._followersCount;
  }

  public set followersCount(value: number) {
    this._followersCount = value;
  }
}
