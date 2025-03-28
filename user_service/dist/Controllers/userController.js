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
exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("../Models/userModel"));
const userValidation_1 = require("../Validation/userValidation");
const hashing_1 = require("../Utils/hashing");
const token_1 = require("../Utils/token");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // console.log(req.body);
    const { error, value } = userValidation_1.signupValidation.validate({ name, email, password });
    if (error) {
        res.status(401).json({ success: false, message: error.details[0].message });
    }
    const existingUser = yield userModel_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already Exists" });
    }
    const hashPassword = yield (0, hashing_1.doHash)(password, 12);
    const newUser = new userModel_1.default({
        name,
        email,
        password: hashPassword
    });
    yield newUser.save();
    newUser.password = undefined;
    res.status(200).json({ success: true, message: "Your account hasbeen created successfully", data: newUser });
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { email, password } = req.body;
    const { error } = userValidation_1.loginValidation.validate({ email, password });
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const existingUser = yield userModel_1.default.findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ success: false, message: "User not found" });
    }
    const credential = yield (0, hashing_1.doHashValidation)(password, (_a = existingUser.password) !== null && _a !== void 0 ? _a : "");
    if (!credential) {
        return res.status(400).json({ success: false, message: "Invalid credential!" });
    }
    const accessToken = (0, token_1.generateAccesstoken)({
        _id: existingUser._id.toString(),
        email: (_b = existingUser.email) !== null && _b !== void 0 ? _b : "",
        role: (_c = existingUser.role) !== null && _c !== void 0 ? _c : "user",
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    });
    existingUser.password = undefined;
    res.status(200).json({ success: true, message: "Successfully loged", data: existingUser });
});
exports.login = login;
