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
const fetchUserLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];
    }
    catch (e) {
        return res.json({ "error": e.message }).status(400);
    }
    console.log(token);
    if (!token) {
        res.json({ "message": "unauthorized" }).status(401);
    }
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, "collins");
    }
    catch (err) {
        console.log(err.message);
    }
    var fetchUserLinksQuery = `SELECT * FROM links WHERE user_id = ( ? )`;
    db_1.default.all(fetchUserLinksQuery, [decodedToken.userId], (fetchErr, links) => {
        if (fetchErr) {
            console.log(fetchErr.message);
        }
        {
            const linkUrls = links.map((link) => ({ id: link.id, url: link.url }));
            return res.json({ "data": linkUrls }).status(200);
        }
    });
});
const DeleteSingleLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(' ')[1];
    const linkId = req.body.linkId;
    if (!token) {
        res.json({ "message": "unauthorized" }).status(401);
    }
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, "collins");
    }
    catch (err) {
        console.log(err.message);
    }
    var deleteLinkQuery = `DELETE FROM links WHERE id = ( ? )`;
    var checkIfLinkExistQuery = `SELECT * FROM links WHERE id = ( ? )`;
    db_1.default.get(checkIfLinkExistQuery, [linkId], (error, existingLink) => {
        console.log("checkIfLinkExistQuery...");
        if (error) {
            console.log(error.message);
            return res.json({ "error": error.message }).status(404);
        }
        if (!existingLink) {
            return res.json({ "message": "Link not found." }).status(404);
        }
        db_1.default.run(deleteLinkQuery, [linkId], (error) => {
            if (error) {
                console.log(error.message);
                return res.json({ "message": "link not found" }).status(404);
            }
            return res.json({ "message": "link deleted succeefully" }).status(200);
        });
    });
});
linkRouter.delete("/", DeleteSingleLinks);
linkRouter.get("/", fetchUserLinks);
linkRouter.post("/", addNewLink);
exports.default = linkRouter;
