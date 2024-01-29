export enum Type {
  text = "Text",
  alias = "Alias",
  url = "URL",
  newline = "Newline",
}

export class PostSegment {
  private _text: string;
  private _startPostion: number;
  private _endPosition: number;
  private _type: Type;

  public constructor(
    text: string,
    startPosition: number,
    endPosition: number,
    type: Type
  ) {
    this._text = text;
    this._startPostion = startPosition;
    this._endPosition = endPosition;
    this._type = type;
  }

  public get text(): string {
    return this._text;
  }

  public get startPostion(): number {
    return this._startPostion;
  }

  public get endPosition(): number {
    return this._endPosition;
  }

  public get type(): Type {
    return this._type;
  }
}
