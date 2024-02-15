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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./models/db"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./models/user");
const user_2 = __importDefault(require("./controllers/user"));
const link_1 = require("./models/link");
const link_2 = __importDefault(require("./controllers/link"));
console.log("lets see");
const app = (0, express_1.default)();
const port = 3000;
(0, user_1.createUserTable)();
(0, link_1.createLinkTable)();
const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080', 'https://larchive-app.vercel.app'];
db_1.default.serialize();
//app.use(cors({ origin: "*", optionsSuccessStatus: 200, credentials: true }))
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ "message": "api works." });
}));
app.use("/auth", user_2.default);
app.use("/link", link_2.default);
app.listen(port, () => { console.log(`running on port : ${port}`); });
