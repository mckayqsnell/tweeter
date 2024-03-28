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
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    loadMoreStoryItems(authTokeDto, userDto, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokeDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            const lastStatusItem = tweeter_shared_1.Status.fromDto(lastItem);
            // TODO: Replace with the result of calling database
            return tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
        });
    }
    loadMoreFeedItems(authTokenDto, userDto, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const user = tweeter_shared_1.User.fromDto(userDto);
            const lastStatusItem = tweeter_shared_1.Status.fromDto(lastItem);
            // TODO: Replace with the result of calling database
            return tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastStatusItem, pageSize);
        });
    }
    postStatus(authTokenDto, newStatusDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const authToken = tweeter_shared_1.AuthToken.fromDto(authTokenDto);
            const newStatus = tweeter_shared_1.Status.fromDto(newStatusDto);
            // Pause so we can see the logging out message. Remove when connected to the server
            // TODO: Replace with the result of calling database
            yield new Promise((f) => setTimeout(f, 2000));
        });
    }
}
exports.StatusService = StatusService;
