"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkTable = void 0;
const db_1 = __importDefault(require("./db"));
const createLinkTable = () => {
    db_1.default.run(`CREATE TABLE links ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url VARCHAR(8000),
    user_id INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)

)`, (error) => {
        if (error) {
            console.log(error.message);
            console.log("Link Table already created");
        }
        else {
            console.log("Link Table created.");
        }
    });
};
exports.createLinkTable = createLinkTable;
