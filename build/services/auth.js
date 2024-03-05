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
exports.verifyToken = exports.createToken = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.user.create({ data }); });
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.user.findFirst({ where: { email } }); });
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.user.findFirst({ where: { id } }); });
exports.getUserById = getUserById;
const createToken = (userId) => __awaiter(void 0, void 0, void 0, function* () { return jsonwebtoken_1.default.sign(userId, process.env.JWT_SECRET); });
exports.createToken = createToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () { return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); });
exports.verifyToken = verifyToken;
