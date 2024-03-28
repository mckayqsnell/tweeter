import { UserDto } from "./UserDto";

export interface FollowDto {
    readonly follower: UserDto;
    readonly followee: UserDto;
}