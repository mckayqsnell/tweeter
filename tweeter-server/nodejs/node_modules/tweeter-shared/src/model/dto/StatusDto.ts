import { PostSegmentDto } from "./PostSegmentDto";
import { UserDto } from "./UserDto";

export interface StatusDto {
  post: string;
  user: UserDto;
  timestamp: number;
  segments: PostSegmentDto[];
}