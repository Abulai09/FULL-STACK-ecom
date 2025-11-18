"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const token_service_1 = require("../token/token.service");
const userDto_1 = require("./dto/userDto");
const JwtAuthGuard_1 = require("../guards/JwtAuthGuard");
let AuthController = class AuthController {
    authServ;
    tokenServ;
    constructor(authServ, tokenServ) {
        this.authServ = authServ;
        this.tokenServ = tokenServ;
    }
    async registration(dto, res) {
        const userDat = await this.authServ.registration(dto);
        res.cookie('refreshToken', userDat.refreshToken, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return { accessToken: userDat.accessToken };
    }
    async login(body) {
        const userDat = await this.authServ.login(body.phoneNumber, body.username, body.password);
        return { message: userDat.message };
    }
    async verifyLoginCode(body, res) {
        const userDat = await this.authServ.verifyLoginCode(body.username, body.code);
        res.cookie('refreshToken', userDat.refreshToken, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return { accessToken: userDat.accessToken };
    }
    async logOut(req, res) {
        const userId = req.user.id;
        res.clearCookie('refreshToken');
        return await this.authServ.logOut(userId);
    }
    async refresh(req, res) {
        const { refreshToken } = req.cookies;
        const tokens = await this.tokenServ.refreshToken(refreshToken);
        res.cookie('refreshToken', tokens.newTokens.refreshToken, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return { accessToken: tokens.newTokens.accessToken };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('registration'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userDto_1.userDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registration", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLoginCode", null);
__decorate([
    (0, common_1.Post)('logOut'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logOut", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        token_service_1.TokenService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map