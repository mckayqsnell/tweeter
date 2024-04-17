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
exports.SQSSender = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
class SQSSender {
    constructor(queueUrl) {
        this.sqsClient = new client_sqs_1.SQSClient({});
        this.queueUrl = queueUrl;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                DelaySeconds: 10,
                QueueUrl: this.queueUrl,
                MessageBody: message,
            };
            try {
                const data = yield this.sqsClient.send(new client_sqs_1.SendMessageCommand(params));
                console.log("Success, message sent. MessageID:", data.MessageId);
            }
            catch (err) {
                console.error("Error sending message to the queue: ", err);
                throw err;
            }
        });
    }
}
exports.SQSSender = SQSSender;
