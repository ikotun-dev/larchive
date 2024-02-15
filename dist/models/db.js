"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const process_1 = require("process");
const isFlyEnvironment = process_1.env.FLY_REGION;
let DB_PATH;
if (isFlyEnvironment) {
    DB_PATH = '/data/db.sqlite'; // Use the Fly.io volume path
}
else {
    DB_PATH = '../db.sqlite'; // Adjust this for your local path
}
//const DBSOURCE = '/usr/src/app/data/db.sqlite3
const DBSOURCE = process.env.DB_PATH || 'data/db.sqlite';
console.log(isFlyEnvironment);
console.log(DB_PATH);
let db = new sqlite3_1.default.Database(DB_PATH, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    else {
        console.log("connected to the sqlite Database");
    }
});
exports.default = db;
