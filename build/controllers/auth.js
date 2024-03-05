"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = exports.Login = exports.Register = void 0;
const zod_1 = __importDefault(require("zod"));
const Auth = __importStar(require("../services/auth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = require("../utils/ApiError");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registerSchema = zod_1.default.object({
        name: zod_1.default.string().max(20, "Nome muito grande"),
        email: zod_1.default.string().email(),
        password: zod_1.default.string()
    });
    const data = registerSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const { email, name, password } = data.data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const exist = yield Auth.getUserByEmail(email);
    if (exist) {
        throw new ApiError_1.ApiErrorValidationFields('Esse e-mail já existe', 400, 'email');
    }
    const newUser = yield Auth.createUser({
        email,
        name,
        hashedPassword
    });
    const { hashedPassword: _ } = newUser, user = __rest(newUser, ["hashedPassword"]);
    return res.json({ User: user, success: "Usuário criado com sucesso" });
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginSchema = zod_1.default.object({
        email: zod_1.default.string().email(),
        password: zod_1.default.string()
    });
    const data = loginSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const user = yield Auth.getUserByEmail(data.data.email);
    if (!user) {
        throw new ApiError_1.ApiErrorValidationFields("Usuário inexistente", 400, "email");
    }
    const passwordCompare = yield bcrypt_1.default.compare(data.data.password, user === null || user === void 0 ? void 0 : user.hashedPassword);
    if (!passwordCompare) {
        throw new ApiError_1.ApiErrorValidationFields("Senha inválida", 400, "password");
    }
    const { hashedPassword: _ } = user, userLogin = __rest(user, ["hashedPassword"]);
    const token = yield Auth.createToken(user.id);
    res.json({ user: userLogin, token });
});
exports.Login = Login;
const Profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        throw new ApiError_1.ApiErrorValidationFields("Não autorizado", 400);
    }
    const { id } = yield Auth.verifyToken(token);
    const user = yield Auth.getUserById(id);
    if (!user) {
        throw new ApiError_1.ApiErrorValidationFields("Não autorizado", 400);
    }
    const { hashedPassword: _ } = user, userInformation = __rest(user, ["hashedPassword"]);
    res.json({ loggedUser: userInformation });
});
exports.Profile = Profile;
