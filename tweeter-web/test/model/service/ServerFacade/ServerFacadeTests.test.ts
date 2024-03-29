// tests/serverFacade/ServerFacade.test.js
import { AuthToken, GetFollowCountRequest, LoadMoreFollowItemsRequest, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../../../src/model/service/ServerFacade/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  it("successfully registers a new user", async () => {
    const request: RegisterRequest = {
      firstName: "Test",
      lastName: "User",
      alias: "@testuser",
      password: "password123",
      imageStringBase64: "base64imagestring==",
    };

    const response = await serverFacade.register(request);
    expect(response).toBeDefined();
    expect(response.success).toBeTruthy();
    expect(response.user).toBeDefined();
    expect(response.token).toBeDefined();
  });

  it("successfully gets the followers of a user", async () => {
    const request: LoadMoreFollowItemsRequest = {
      authToken: new AuthToken("token", 77777),
      user: {
        alias: "testuser",
        firstName: "Test",
        lastName: "User",
        imageUrl: "base64imagestring==",
      },
        pageSize: 10,
        lastItem: null,
    };

    const response = await serverFacade.loadMoreFollowers(request);
    expect(response).toBeDefined();
    expect(response.success).toBeTruthy();
    expect(response.users).toBeDefined();
    expect(response.users.length).toBeGreaterThan(0);
    expect(response.hasMorePages).toBeDefined();
  });

  it("successfully gets the follower counts and followee counts of a user", async () => {
    const request: GetFollowCountRequest = {
      authToken: new AuthToken("token", 77777),
      user: {
        alias: "@allen",
        firstName: "Allen",
        lastName: "Anderson",
        imageUrl: "base64imagestring==",
      },
    };

    const response = await serverFacade.getFollowersCount(request);
    expect(response).toBeDefined();
    expect(response.success).toBeTruthy();
    expect(response.count).toBeDefined();

    const response2 = await serverFacade.getFolloweesCount(request);
    expect(response2).toBeDefined();
    expect(response2.success).toBeTruthy();
    expect(response2.count).toBeDefined();
  });
});
