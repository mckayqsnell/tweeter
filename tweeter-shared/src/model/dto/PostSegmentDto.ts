import { Type } from "../domain/PostSegment";

export interface PostSegmentDto {
  text: string;
  startPostion: number;
  endPosition: number;
  type: Type;
}
