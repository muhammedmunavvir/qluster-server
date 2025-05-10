"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorhandler = void 0;
const asyncErrorhandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncErrorhandler = asyncErrorhandler;
