"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
const mongoseEnv = process.env.MONGO_URI;
if (!mongoseEnv) {
    throw new Error("Mongoose URI is missing!");
}
mongoose_1.default.connect(mongoseEnv)
    .then(() => { console.log("Database connected"); })
    .catch((err) => { console.log(err); });
app.listen(process.env.PORT || 5004, () => {
    console.log(`🚀 Server is running on port 5004`);
});
