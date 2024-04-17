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
const BaseService_1 = require("./BaseService");
class FollowService extends BaseService_1.BaseService {
    constructor(factory, authService) {
        super(factory, authService);
        this.loadMoreFollowers = (authTokenDto, userDto, pageSize, lastItem) => __awaiter(this, void 0, void 0, function* () {
            console.log("loadMoreFollowers in follow service");
            console.log("authTokenDto", authTokenDto);
            console.log("userDto", userDto);
            console.log("pageSize", pageSize);
            console.log("lastItem", lastItem);
            return this.loadMore(authTokenDto, userDto, pageSize, lastItem, true, this.followDAO.getPageOfFollowers);
        });
        this.loadMoreFollowees = (authTokenDto, userDto, pageSize, lastItem) => __awaiter(this, void 0, void 0, function* () {
            console.log("loadMoreFollowees in follow service");
            console.log("authTokenDto", authTokenDto);
            console.log("userDto", userDto);
            console.log("pageSize", pageSize);
            console.log("lastItem", lastItem);
            return this.loadMore(authTokenDto, userDto, pageSize, lastItem, false, this.followDAO.getPageOfFollowees);
        });
        this.loadMore = (authTokenDto, userDto, pageSize, lastItem, follower, daoFunction) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokenDto, userDto, pageSize]);
            try {
                //validate the authToken
                const validated = yield this.authService.validateAuthToken(authTokenDto);
                if (!validated) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                const lastItemAlias = lastItem ? lastItem.alias : undefined; // check if lastItem is present
                console.log(`lastItemAlias: ${lastItemAlias}`);
                const [follows, hasMore] = yield daoFunction(userDto.alias, pageSize, lastItemAlias);
                console.log(`follows: ${follows} hasMore: ${hasMore}`);
                //convert the follows to UserDtos
                const followsDto = follows.map((follow) => this.followDBToDto(follow, follower));
                console.log(`followsDto: ${followsDto} hasMore: ${hasMore}`);
                return [followsDto, hasMore];
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to load more: ${error}`);
            }
        });
        this.getIsFollowerStatus = (authTokenDto, userDto, selectedUserDto) => __awaiter(this, void 0, void 0, function* () {
            console.log("getIsFollowerStatus in follow service");
            console.log("authTokenDto", authTokenDto);
            console.log("userDto", userDto);
            console.log("selectedUserDto", selectedUserDto);
            this.validateRequiredFields([authTokenDto, userDto, selectedUserDto]);
            try {
                //validate the authToken
                const validated = yield this.authService.validateAuthToken(authTokenDto);
                if (!validated) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                const alias = yield this.authService.getAlias(authTokenDto);
                // lookup the user in the database
                const user = yield this.userDAO.getUser(alias);
                if (!user) {
                    throw new Error(`[Bad Request] user ${alias} who wants to getIsFollowerStatus does not exist`);
                }
                const selectedUser = yield this.userDAO.getUser(selectedUserDto.alias);
                if (!selectedUser) {
                    throw new Error(`[Bad Request] selectedUser for getIsFollowerStatus does not exist`);
                }
                const isFollower = yield this.followDAO.getIsFollowerStatus(user, selectedUser);
                console.log(`isFollower: ${isFollower} for ${selectedUserDto.alias}`);
                return isFollower;
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to get isFollowerStatus: ${error}`);
            }
        });
        this.getFolloweesCount = (authTokenDto, userDto) => __awaiter(this, void 0, void 0, function* () {
            return this.getFollowCounts(authTokenDto, userDto, (alias) => this.userDAO.getUser(alias), "followees");
        });
        this.getFollowersCount = (authTokenDto, userDto) => __awaiter(this, void 0, void 0, function* () {
            return this.getFollowCounts(authTokenDto, userDto, (alias) => this.userDAO.getUser(alias), "followers");
        });
        this.getFollowCounts = (authTokenDto, userDto, daoFunction, operation) => __awaiter(this, void 0, void 0, function* () {
            console.log("getFollowCounts in follow service");
            console.log("authTokenDto", authTokenDto);
            console.log("userDto", userDto);
            this.validateRequiredFields([authTokenDto, userDto]);
            try {
                //validate the authToken
                const validated = yield this.authService.validateAuthToken(authTokenDto);
                if (!validated) {
                    throw new Error("[AuthError] unauthenticated request");
                }
                const user = yield daoFunction(userDto.alias);
                if (!user) {
                    throw new Error(`[Bad Request] user for getFollowCounts does not exist`);
                }
                const count = operation === "followers" ? user.followersCount : user.followeesCount;
                console.log(`count: ${count} returned for ${userDto.alias}`);
                return count;
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to get follow count: ${error}`);
            }
        });
        this.follow = (authTokenDto, userToFollowDto) => __awaiter(this, void 0, void 0, function* () {
            return this.unFollowOrFollow(authTokenDto, userToFollowDto, this.followDAO.follow, "follow");
        });
        this.unfollow = (authTokenDto, userToUnfollowDto) => __awaiter(this, void 0, void 0, function* () {
            return this.unFollowOrFollow(authTokenDto, userToUnfollowDto, this.followDAO.unfollow, "unfollow");
        });
        this.unFollowOrFollow = (authTokenDto, userToUnfollowDto, daoFunction, operation) => __awaiter(this, void 0, void 0, function* () {
            this.validateRequiredFields([authTokenDto, userToUnfollowDto]);
            try {
                yield this.validateAuthToken(authTokenDto);
                const alias = yield this.authService.getAlias(authTokenDto);
                // lookup the user in the database
                const userdb = yield this.userDAO.getUser(alias);
                if (!userdb) {
                    throw new Error(`[Bad Request] user ${alias} who wants to ${operation} does not exist`);
                }
                const userToUnfollowOrFollow = yield this.userDAO.getUser(userToUnfollowDto.alias);
                if (!userToUnfollowOrFollow) {
                    throw new Error(`[Bad Request] userTo${operation} for ${operation} does not exist`);
                }
                if (operation === "follow") {
                    yield this.userDAO.incrementFolloweesCount(alias);
                    yield this.userDAO.incrementFollowersCount(userToUnfollowDto.alias);
                }
                else {
                    yield this.userDAO.decrementFolloweesCount(alias);
                    yield this.userDAO.decrementFollowersCount(userToUnfollowDto.alias);
                }
                yield daoFunction(userdb, userToUnfollowOrFollow);
                // get the updated counts for this user
                const updatedUser = yield this.userDAO.getUser(alias);
                const followersCount = updatedUser.followersCount;
                const followeesCount = updatedUser.followeesCount;
                return [followersCount, followeesCount];
            }
            catch (error) {
                console.error(error);
                throw new Error(`[Internal Server Error] failed to ${operation}: ${error}`);
            }
        });
        this.followDBToDto = (followDB, follower) => {
            if (follower) {
                return {
                    alias: followDB.followerAlias,
                    firstName: followDB.followerFirstName,
                    imageUrl: followDB.followerImageUrl,
                    lastName: followDB.followerLastName,
                };
            }
            else {
                return {
                    alias: followDB.followeeAlias,
                    firstName: followDB.followeeFirstName,
                    imageUrl: followDB.followeeImageUrl,
                    lastName: followDB.followeeLastName,
                };
            }
        };
        this.followDAO = factory.getFollowDAO();
        this.userDAO = factory.getUserDAO();
    }
}
exports.FollowService = FollowService;
