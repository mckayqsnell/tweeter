import { PostSegmentDto } from "./PostSegmentDto";
import { UserDto } from "./UserDto";

export interface StatusDto {
  post: string;
  user: UserDto | null;
  timestamp: number;
}