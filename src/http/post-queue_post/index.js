"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const functions_1 = __importDefault(require("@architect/functions"));
async function handler(req) {
    let body = functions_1.default.http.helpers.bodyParser(req);
    let name = 'queue-task-proxy';
    let payload = body;
    await functions_1.default.queues.publish({ name, payload });
    return { statusCode: 200, body: 'Message Sent' };
}
exports.handler = handler;
