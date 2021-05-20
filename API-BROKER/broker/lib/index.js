"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const broker_1 = __importDefault(require("./broker"));
const broker = new broker_1.default();
(async () => {
    try {
        await broker.init();
        broker.run();
    }
    catch (error) {
        console.log(error);
    }
})();
