import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setUserInfo: (user: User) => void;
}

export class UserInfoPresenter extends Presenter {
  private service: FollowService;
  private _isFollower: boolean = false;
  private _followeesCount: number = -1;
  private _followersCount: number = -1;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  protected get view(): UserInfoView {
    return super.view as UserInfoView;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.service.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.followeesCount = await this.service.getFolloweesCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.followersCount = await this.service.getFollowersCount(
        authToken,
        displayedUser
      );
    }, "get followers count");
  }

  public async followUser(displayedUser: User, authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(
        `Adding ${displayedUser!.name} to followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.isFollower = true;
      this.followersCount = followersCount;
      this.followeesCount = followeesCount;
    }, "follow user");
  }

  public async unfollowUser(displayedUser: User, authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
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
    }, "unfollow user");
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
