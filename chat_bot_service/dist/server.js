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
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
if (!(process === null || process === void 0 ? void 0 : process.env.GOOGLE_API_KEY)) {
    throw new Error("Missing API Key");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process === null || process === void 0 ? void 0 : process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);
    socket.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chat = model.startChat({ history: [] });
            const result = yield chat.sendMessage(message);
            let text = result.response.text();
            text = text
                .replace(/\*\*(.*?)\*\*/g, "$1") // remove **bold**
                .replace(/\*(.*?)\*/g, "$1") // remove *italic*
                .replace(/^- /gm, "") // remove bullet dashes at start of line
                .replace(/^\s*[\*\-]\s?/gm, "") // remove leading bullets like *, -
                //  .replace(/\n{2,}/g, "\n\n");     // reduce multiple newlines
                .replace(/\*\*.*?\*\*/g, ""); // Removes bolded markdown headings
            socket.emit("reply", text);
        }
        catch (err) {
            console.error("Gemini Error:", err);
            socket.emit("reply", "❌ Error getting response from Gemini.");
        }
    }));
    socket.on("disconnect", () => {
        console.log("🚫 User disconnected:", socket.id);
    });
});
app.use(express_1.default.json());
console.log("odeda");
app.get("/chat-bot", (req, res) => {
    res.send("Gemini Chatbot Backend Running!");
});
server.listen(process.env.PORT || 5005, () => console.log("🚀 Server running on 5005"));
