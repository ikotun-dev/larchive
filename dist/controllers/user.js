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
    console.log("entered");
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
                res.json({ "message": "User with this username already exists", "statusCode": 401 }).status(400);
            }
            else {
                db_1.default.run(insertUserQuery, [username, hashedPassword], (insertErr) => {
                    if (insertErr) {
                        console.error(insertErr.message);
                    }
                    console.log(`User ${username} created successfully`);
                    return res.json({ "message": "User created successfully", "statusCode": 201 }).status(201);
                });
            }
        });
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.default.all('SELECT * FROM users', (error, users) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        const userList = users;
        return res.status(200).json({ data: userList });
    });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log("entered..login");
    const username = (_c = req.body) === null || _c === void 0 ? void 0 : _c.username;
    const password = (_d = req.body) === null || _d === void 0 ? void 0 : _d.password;
    if (!username || !password) {
        res.json({ "message": "Invalid Request" }).status(400);
    }
    console.log("Right before db stuff");
    console.log(`${username}, ${password}`);
    db_1.default.get(checkExistingUsernameQuery, [username], (err, existingUser) => {
        console.log(`${err} , ${existingUser}`);
        if (err == null && !existingUser) {
            console.log("....");
            res.json({ 'message': "Invalid username", "statusCode": 404 }).status(404);
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
                    res.json({ "message": "user does not exist", "statusCode": 401 });
                }
                const { id, username } = user;
                const accessToken = jsonwebtoken_1.default.sign({ userId: id }, "collins", { expiresIn: "1d" });
                console.log(`${username} logged in successfully`);
                res.status(200).json({ "message": "login succesful", "accessToken": `${accessToken}`, "statusCode": 200 });
            });
        }
    });
});
userRouter.get("/all", getAllUsers);
userRouter.post("/signup", createNewUser);
userRouter.post("/login", login);
exports.default = userRouter;
