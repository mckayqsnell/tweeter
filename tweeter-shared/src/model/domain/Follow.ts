import { FollowDto } from "../dto/FollowDto";
import { User } from "./User";

export class Follow {
    private _follower: User | null;
    private _followee: User | null;

    public constructor(follower: User | null, followee: User | null) {
        this._follower = follower;
        this._followee = followee;
    }

    public get follower(): User {
        return this._follower!;
    }

    public set follower(value: User) {
        this._follower = value;
    }
    
    public get followee(): User {
        return this._followee!;
    }

    public set followee(value: User) {
        this._followee = value;
    }
    
    public static fromJsonString(json: string | null | undefined): Follow | null {
        return json ? this.fromDto(JSON.parse(json)) : null;
    }

    public static fromDto(dto: FollowDto | null | undefined): Follow | null {
        return dto ? new Follow(User.fromDto(dto.follower), User.fromDto(dto.followee)) : null;
    }

    public get dto(): FollowDto {
        return {
            follower: this.follower.dto,
            followee: this.followee.dto,
        };
    }

    public toJson(): string {
        return JSON.stringify(this.dto);
    }
}
