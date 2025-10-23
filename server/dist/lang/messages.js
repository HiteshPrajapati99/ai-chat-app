"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = exports.successMessages = void 0;
exports.successMessages = {
    success: "Your request is successfully executed",
    register: "User registration success.",
    login: "Login successfuly!",
    // Chat
    chatCreated: "Chat created successfully!",
    chatDeleted: "Chat deleted successfully!",
    chatList: "Chat list fetched successfully!",
    chatDetails: "Chat details fetched successfully!",
    userRemoved: "User removed successfully!",
    // Message
    messageSent: "Message sent successfully!",
    messageList: "Message list fetched successfully!",
};
exports.errorMessages = {
    invalidCred: "Invalid credentials!",
    updateProfileField: "min 1 field required for update user profile.",
    userIdReqError: "user_id is required...",
    badRequest: "Oops! something went wrong. Please try again.",
    serverError: "Internal server error , Please try after some time.",
    validationError: "Invalid input data: It seems there are some issues with your submission.",
    missingField: "The request is missing a required field",
    recordNotFound: "No Data Found !",
    unAuthorized: "You are unAuthorized try after login !",
    receiver_idReqError: "receiver_id is required.",
    chatIdReqError: "chat_id is required.",
    invalidChatId: "Invalid chat_id.",
};
