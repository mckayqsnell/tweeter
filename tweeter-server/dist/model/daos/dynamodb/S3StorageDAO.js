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
exports.S3StorageDAO = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const BUCKET = "340tweeteruserimages";
const REGION = "us-west-2";
class S3StorageDAO {
    putImage(fileName, imageStringBase64Encoded) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");
            const s3Params = {
                Bucket: BUCKET,
                Key: "image/" + fileName,
                Body: decodedImageBuffer,
                ContentType: "image/png",
                ACL: client_s3_1.ObjectCannedACL.public_read,
            };
            const c = new client_s3_1.PutObjectCommand(s3Params);
            const client = new client_s3_1.S3Client({ region: REGION });
            try {
                yield client.send(c);
                return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
            }
            catch (error) {
                throw Error("s3 put image failed with: " + error);
            }
        });
    }
}
exports.S3StorageDAO = S3StorageDAO;
