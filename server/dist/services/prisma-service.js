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
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.databaseService = void 0;
const prisma_db_1 = require("../prisma-db");
class PrismaService {
    constructor() {
        this.client = new prisma_db_1.PrismaClient();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.$connect();
                console.log("DB connected successfully");
            }
            catch (error) {
                yield this.client.$disconnect();
                console.log("DB disconnected with error", error);
            }
        });
    }
}
exports.databaseService = new PrismaService();
exports.db = exports.databaseService.client;
