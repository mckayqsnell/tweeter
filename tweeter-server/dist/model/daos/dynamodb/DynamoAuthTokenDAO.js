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
exports.DynamoAuthTokenDAO = void 0;
const DynamoDAO_1 = require("./DynamoDAO");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoAuthTokenDAO extends DynamoDAO_1.DynamoDAO {
    constructor() {
        super(...arguments);
        this.getToken = (token) => __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                console.error("getToken called with undefined or null token");
                throw new Error("getToken called with undefined or null token");
            }
            const params = {
                TableName: "authtokens",
                Key: {
                    token: token,
                },
            };
            try {
                const response = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
                console.log(`Successfully retrieved token ${token} from the database`);
                return response.Item;
            }
            catch (error) {
                console.error(`Error retrieving token ${token} from the database: ${error}`);
                throw new Error(`Error retrieving token ${token} from the database: ${error}`);
            }
        });
        this.storeToken = (authTokenDB) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "authtokens",
                Item: {
                    token: authTokenDB.token,
                    expiretime: authTokenDB.expiretime,
                    alias: authTokenDB.alias,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.PutCommand(params));
                console.log(`Successfully stored token ${authTokenDB.token} in the database`);
            }
            catch (error) {
                console.error(`Error storing token ${authTokenDB.token} in the database: ${error}`);
                throw new Error(`Error storing token ${authTokenDB.token} in the database: ${error}`);
            }
        });
        this.deleteToken = (token) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Deleting token ${token} in DynamoAuthTokenDAO`);
            const params = {
                TableName: "authtokens",
                Key: {
                    token: token,
                },
            };
            try {
                yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
                console.log(`Successfully deleted token ${token} from the database`);
            }
            catch (error) {
                console.error(`Error deleting token ${token} from the database: ${error}`);
                throw new Error(`Error deleting token ${token} from the database: ${error}`);
            }
        });
    }
}
exports.DynamoAuthTokenDAO = DynamoAuthTokenDAO;
