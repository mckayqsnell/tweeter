import { AuthToken, LoadMoreStatusItemsRequest, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("StatusService Integration Tests", () => {
    let statusService: StatusService;
    
    beforeAll(() => {
        statusService = new StatusService();
    });
    
    it("successfully loads more story items", async () => {
        const authToken =  new AuthToken("token", 77777);
        const user = new User("Test", "User", "@testuser", "base64imagestring==");
        const pageSize = 10;
        const lastItem = null;
    
        const [StatusItems, hasMorePages] = await statusService.loadMoreStoryItems(authToken, user, pageSize, lastItem);
        expect(StatusItems).toBeDefined();
        expect(StatusItems.length).toBeGreaterThan(0);
        expect(hasMorePages).toBeDefined();
        expect(hasMorePages).toBeTruthy();
    });
});