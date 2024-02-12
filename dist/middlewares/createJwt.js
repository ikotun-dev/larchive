"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = exports.jwtSecretKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwtSecretKey = "$ninininnpsbidjoblodbasljdow944p9nldjbudl";
function createJWT(userPayload) {
    const expiresIn = '1d';
    const token = jsonwebtoken_1.default.sign(userPayload, exports.jwtSecretKey, { expiresIn });
    return token;
}
exports.createJWT = createJWT;
Promise < UserPayload | null > {
    return: new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, exports.jwtSecretKey, ());
    })
};
