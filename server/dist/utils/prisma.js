"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastMessageSelect = exports.includeUsersExpectCurr = void 0;
const includeUsersExpectCurr = (id) => {
    return {
        users: {
            where: {
                user_id: {
                    not: { equals: id },
                },
            },
            select: {
                user: { select: { name: true, id: true, profile_pic: true } },
            },
        },
    };
};
exports.includeUsersExpectCurr = includeUsersExpectCurr;
const lastMessageSelect = () => {
    return {
        last_message: {
            select: { content: true, id: true, created_at: true },
        },
    };
};
exports.lastMessageSelect = lastMessageSelect;
