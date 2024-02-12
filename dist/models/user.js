"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTable = void 0;
const db_1 = __importDefault(require("./db"));
const createUserTable = () => db_1.default.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
)`, (error) => {
    if (error) {
        console.error("Table already created");
    }
    else {
        console.log("Table User created");
    }
});
exports.createUserTable = createUserTable;
