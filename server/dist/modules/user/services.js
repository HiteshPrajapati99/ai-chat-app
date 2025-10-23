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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_1 = require("../../services/prisma-service");
class UserServices {
}
_a = UserServices;
UserServices.getUser = ({ username, id }) => {
    if (id)
        return prisma_service_1.db.user.findFirst({ where: { id } });
    return prisma_service_1.db.user.findFirst({ where: { username } });
};
UserServices.getAllUsers = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma_service_1.db.user.findMany({
        where: {
            AND: [{ NOT: { id: id } }],
            OR: [{ NOT: { username: "ai" } }],
        },
    });
    return data || [];
});
UserServices.create = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_service_1.db.user.create({ data: user });
});
exports.default = UserServices;
