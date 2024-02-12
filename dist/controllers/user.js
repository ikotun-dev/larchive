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
const ts_md5_1 = require("ts-md5");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../models/db"));
const userRouter = (0, express_1.Router)();
var insertUserQuery = `INSERT into users (username, password) VALUES (?, ?)`;
var checkExistingUsernameQuery = `SELECT * FROM users WHERE username = ?`;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(req.body);
    const username = (_a = req.body) === null || _a === void 0 ? void 0 : _a.username;
    const password = (_b = req.body) === null || _b === void 0 ? void 0 : _b.password;
    if (!username || !password) {
        res.json({ "message": "Invalid request" }).status(400);
    }
    else {
        console.log(`${username} is trying to signup`);
        const hashedPassword = ts_md5_1.Md5.hashStr(password);
        db_1.default.get(checkExistingUsernameQuery, [username], (err, existingUser) => {
            if (err) {
                console.error(err);
                res.json({ "message": "Internal Server Error" }).status(500);
            }
            if (existingUser) {
                res.json({ "message": "User with this username already exists" }).status(400);
            }
            else {
                db_1.default.run(insertUserQuery, [username, hashedPassword], (insertErr) => {
                    if (insertErr) {
                        console.error(insertErr.message);
                    }
                    console.log(`User ${username} created successfully`);
                    return res.json({ "message": "User created successfully" }).status(201);
                });
            }
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const username = (_c = req.body) === null || _c === void 0 ? void 0 : _c.username;
    const password = (_d = req.body) === null || _d === void 0 ? void 0 : _d.password;
    if (!username || !password) {
        res.json({ "message": "Invalid Request" }).status(400);
    }
    db_1.default.get(checkExistingUsernameQuery, [username], (err, existingUser) => {
        if (err) {
            console.error(err.message);
            res.json({ 'message': "Invalid username" }).status(500);
        }
        if (existingUser) {
            const hashedPassword = ts_md5_1.Md5.hashStr(password);
            const validateUserQuery = `SELECT * FROM users WHERE username = ? AND password = ?`;
            console.log(hashedPassword);
            db_1.default.get(validateUserQuery, [username, hashedPassword], (validateQueryErr, user) => {
                if (validateQueryErr) {
                    console.error(validateQueryErr.message);
                }
                if (!user) {
                    res.json({ "message": "user does not exist" });
                }
                const { id, username } = user;
                const accessToken = jsonwebtoken_1.default.sign({ userId: id }, "collins", { expiresIn: "1h" });
                console.log(`${username} logged in successfully`);
                return res.json({ "message": "login succesful", "accessToken": `${accessToken}` }).status(200);
            });
        }
    });
});
userRouter.post("/signup", createNewUser);
userRouter.post("/login", login);
exports.default = userRouter;
