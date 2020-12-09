"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const statusMapper_1 = __importDefault(require("./statusMapper"));
async function handler(event) {
    const body = JSON.parse(event.Records[0].body);
    let status = statusMapper_1.default(body);
    console.log("Status we will do something", status);
    return;
}
exports.handler = handler;
