"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    loadMoreFollowers(authTokenDto, userDto, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            const lastUserItem = tweeter_shared_1.User.fromDto(lastItem);
            // TODO: Replace with the result of calling the database
            return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastUserItem, pageSize, user);
        });
    }
    loadMoreFollowees(authTokenDto, userDto, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            const lastUserItem = tweeter_shared_1.User.fromDto(lastItem);
            // TODO: Replace with the result of calling database
            return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastUserItem, pageSize, user);
        });
    }
    getIsFollowerStatus(authTokenDto, userDto, selectedUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            const selectedUser = tweeter_shared_1.User.fromDto(selectedUserDto);
            // TODO: Replace with the result of calling database
            return tweeter_shared_1.FakeData.instance.isFollower();
        });
    }
    getFolloweesCount(authTokenDto, userDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            // TODO: Replace with the result of calling the database
            return tweeter_shared_1.FakeData.instance.getFolloweesCount(user);
        });
    }
    getFollowersCount(authTokenDto, userDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            // TODO: Replace with the result of calling the database
            return tweeter_shared_1.FakeData.instance.getFollowersCount(user);
        });
    }
    follow(authTokenDto, userToFollowDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the following message. Remove when connected to the server
            yield new Promise((f) => setTimeout(f, 2000));
            // TODO: Call the the database
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const userToFollow = tweeter_shared_1.User.fromDto(userToFollowDto);
            let followersCount = yield this.getFollowersCount(authToken, userToFollow);
            let followeesCount = yield this.getFolloweesCount(authToken, userToFollow);
            return [followersCount, followeesCount];
        });
    }
    unfollow(authTokenDto, userToUnfollowDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the unfollowing message. Remove when connected to the server
            yield new Promise((f) => setTimeout(f, 2000));
            // TODO: Call the server
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const userToUnfollow = tweeter_shared_1.User.fromDto(userToUnfollowDto);
            let followersCount = yield this.getFollowersCount(authToken, userToUnfollow);
            let followeesCount = yield this.getFolloweesCount(authToken, userToUnfollow);
            return [followersCount, followeesCount];
        });
    }
}
exports.FollowService = FollowService;