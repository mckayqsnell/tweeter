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
exports.handler = void 0;
const DynamoDBDAOFactory_1 = require("../model/factory/DynamoDBDAOFactory");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const factory = DynamoDBDAOFactory_1.DynamoDBDAOFactory.getInstance();
    const feedDAO = factory.getFeedDAO();
    for (const record of event.Records) {
        console.log("Processing record", JSON.stringify(record, null, 2));
        const feedUpdates = JSON.parse(record.body);
        console.log("feedUpdates:", feedUpdates);
        try {
            yield feedDAO.postFeedItems(feedUpdates);
            console.log(`Successfully posted feed items for ${feedUpdates.length} users.`);
        }
        catch (error) {
            console.error(`Error posting feed items: ${error}`);
            throw new Error(`Error posting feed items: ${error}`);
        }
    }
});
exports.handler = handler;
