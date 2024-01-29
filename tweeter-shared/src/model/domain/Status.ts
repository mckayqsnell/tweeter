import { PostSegment, Type } from "./PostSegment";
import { User } from "./User";
import moment from "moment";

export class Status {
  private _post: string;
  private _user: User;
  private _timestamp: number;
  private _segments: PostSegment[];

  public constructor(post: string, user: User, timestamp: number) {
    this._post = post;
    this._user = user;
    this._timestamp = timestamp;
    this._segments = this.getPostSegments(post);
  }

  private getPostSegments(post: string): PostSegment[] {
    let segments: PostSegment[] = [];

    let startIndex = 0;

    for (let reference of Status.getSortedReferences(post)) {
      if (startIndex < reference.startPostion) {
        segments.push(
          new PostSegment(
            post.substring(startIndex, reference.startPostion),
            startIndex,
            reference.startPostion - 1,
            Type.text
          )
        );
      }

      segments.push(reference);

      startIndex = reference.endPosition;
    }

    if (startIndex < post.length) {
      segments.push(
        new PostSegment(
          post.substring(startIndex),
          startIndex,
          post.length,
          Type.text
        )
      );
    }

    return segments;
  }

  private static getSortedReferences(post: string): PostSegment[] {
    let references = [
      ...Status.parseUrlReferences(post),
      ...Status.parseMentionReferences(post),
      ...Status.parseNewlines(post),
    ];

    references.sort((a, b) => {
      return a.startPostion - b.startPostion;
    });

    return references;
  }

  private static parseUrlReferences(post: string): PostSegment[] {
    let references: PostSegment[] = [];

    let urls: string[] = Status.parseUrls(post);

    let previousStartIndex = 0;

    for (let url of urls) {
      let startIndex = post.indexOf(url, previousStartIndex);

      if (startIndex > -1) {
        // Push the url
        references.push(
          new PostSegment(url, startIndex, startIndex + url.length, Type.url)
        );

        // Move start and previous start past the url
        startIndex = startIndex + url.length;
        previousStartIndex = startIndex;
      }
    }

    return references;
  }

  private static parseUrls(post: string): string[] {
    let urls: string[] = [];

    for (let word of post.split(/(\s+)/)) {
      if (word.startsWith("http://") || word.startsWith("https://")) {
        let endIndex = Status.findUrlEndIndex(word);
        urls.push(word.substring(0, endIndex));
      }
    }

    return urls;
  }

  private static findUrlEndIndex(word: string): number {
    let index;

    if (word.includes(".com")) {
      index = word.indexOf(".com");
      index += 4;
    } else if (word.includes(".net")) {
      index = word.indexOf(".net");
      index += 4;
    } else if (word.includes(".org")) {
      index = word.indexOf(".org");
      index += 4;
    } else if (word.includes(".edu")) {
      index = word.indexOf(".edu");
      index += 4;
    } else if (word.includes(".mil")) {
      index = word.indexOf(".mil");
      index += 4;
    } else {
      index = word.length;

      // Remove trailing non-alphabetic characters (such as punctuation) that can't be at the end of a url
      while (!Status.isLetter(word[index])) {
        index--;
      }
    }

    return index;
  }

  private static isLetter(c: string): boolean {
    return c.length === 1 && c.match(/[a-zA-Z]/g) != null;
  }

  private static parseMentionReferences(post: string): PostSegment[] {
    let references: PostSegment[] = [];

    let mentions: string[] = Status.parseMentions(post);

    let previousStartIndex = 0;

    for (let mention of mentions) {
      let startIndex = post.indexOf(mention, previousStartIndex);

      if (startIndex > -1) {
        // Push the alias
        references.push(
          new PostSegment(
            mention,
            startIndex,
            startIndex + mention.length,
            Type.alias
          )
        );

        // Move start and previous start past the mention
        startIndex = startIndex + mention.length;
        previousStartIndex = startIndex;
      }
    }

    return references;
  }

  private static parseMentions(post: string): string[] {
    let mentions: string[] = [];

    for (let word of post.split(/(\s+)/)) {
      if (word.startsWith("@")) {
        // Remove all non-alphanumeric characters
        word.replaceAll(/[^a-zA-Z0-9]/g, "");

        mentions.push(word);
      }
    }

    return mentions;
  }

  private static parseNewlines(post: string): PostSegment[] {
    let newlines: PostSegment[] = [];

    const regex = /\n/g;

    let match;
    while ((match = regex.exec(post)) !== null) {
      const matchIndex = match.index;
      newlines.push(
        new PostSegment("\n", matchIndex, matchIndex + 1, Type.newline)
      );
    }

    return newlines;
  }

  public get post(): string {
    return this._post;
  }

  public set post(value: string) {
    this._post = value;
  }

  public get user(): User {
    return this._user;
  }

  public set user(value: User) {
    this._user = value;
  }

  public get timestamp(): number {
    return this._timestamp;
  }

  public get formattedDate(): string {
    let date: Date = new Date(this.timestamp);
    return moment(date).format("DD-MMM-YYYY HH:mm:ss");
  }

  public set timestamp(value: number) {
    this._timestamp = value;
  }

  public get segments(): PostSegment[] {
    return this._segments;
  }

  public set segments(value: PostSegment[]) {
    this._segments = value;
  }

  public equals(other: Status): boolean {
    return (
      this._user.equals(other.user) &&
      this._timestamp === other._timestamp &&
      this._post === other.post
    );
  }

  public static fromJson(json: string | null | undefined): Status | null {
    if (!!json) {
      let jsonObject: {
        _post: string;
        _user: {
          _firstName: string;
          _lastName: string;
          _alias: string;
          _imageUrl: string;
        };
        _timestamp: number;
        _segments: PostSegment[];
      } = JSON.parse(json);
      return new Status(
        jsonObject._post,
        new User(
          jsonObject._user._firstName,
          jsonObject._user._lastName,
          jsonObject._user._alias,
          jsonObject._user._imageUrl
        ),
        jsonObject._timestamp
      );
    } else {
      return null;
    }
  }

  public toJson(): string {
    return JSON.stringify(this);
  }
}
