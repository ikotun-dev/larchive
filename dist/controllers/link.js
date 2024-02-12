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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../models/db"));
const linkRouter = (0, express_1.Router)();
const addNewLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        res.json({ "message": "unauthorized" }).status(401);
    }
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, "collins");
    }
    catch (error) {
        console.log(error.message);
    }
    console.log(decodedToken.userId);
    const linkUrl = (_a = req.body) === null || _a === void 0 ? void 0 : _a.linkUrl;
    if (!linkUrl) {
        res.json({ "message": "please give a link" }).status(400);
    }
    var insertLinkQuery = `INSERT INTO links (url, user_id) VALUES (?, ?)`;
    db_1.default.run(insertLinkQuery, [linkUrl, decodedToken.userId], (insertErr) => {
        if (insertErr) {
            console.log(insertErr);
        }
        res.json({ "message": "link added succeefully" }).status(201);
    });
});
linkRouter.post("/", addNewLink);
exports.default = linkRouter;
