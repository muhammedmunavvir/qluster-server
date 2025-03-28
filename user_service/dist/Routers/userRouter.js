"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncErrorHandler_1 = require("../Middlewares/asyncErrorHandler");
const userController_1 = require("../Controllers/userController");
const router = express_1.default.Router();
router.post("/signup", (0, asyncErrorHandler_1.asyncErrorhandler)(userController_1.signup));
router.post("/login", (0, asyncErrorHandler_1.asyncErrorhandler)(userController_1.login));
exports.default = router;
