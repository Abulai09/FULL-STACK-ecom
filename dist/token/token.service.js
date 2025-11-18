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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const token_entity_1 = require("./token.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let TokenService = class TokenService {
    userRepo;
    tokenRepo;
    jwtServ;
    constructor(userRepo, tokenRepo, jwtServ) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.jwtServ = jwtServ;
    }
    generateWebTokens(payload) {
        console.log(payload);
        const accessToken = this.jwtServ.sign({
            id: payload.id,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            sessionVersion: payload.sessionVersion,
            role: payload.role,
        }, { expiresIn: '15m' });
        const refreshToken = this.jwtServ.sign({
            id: payload.id,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            sessionVersion: payload.sessionVersion,
            role: payload.role,
        }, { secret: process.env.JWT_REFRESH, expiresIn: '2d' });
        return { accessToken, refreshToken };
    }
    async saveToken(refreshToken, userId) {
        try {
            const hashToken = await bcrypt.hash(refreshToken, 10);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 2);
            const existing = await this.tokenRepo.findOne({
                where: { userId },
                relations: ['user'],
            });
            if (existing) {
                existing.hashedToken = hashToken;
                existing.expiresIn = expiresAt;
                existing.revoked = false;
                return await this.tokenRepo.save(existing);
            }
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.UnauthorizedException('Unauthorized!');
            const newTokens = this.tokenRepo.create({
                hashedToken: hashToken,
                expiresIn: expiresAt,
                user,
                userId,
            });
            return await this.tokenRepo.save(newTokens);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async removeToken(userId) {
        try {
            const token = await this.tokenRepo.findOne({ where: { userId } });
            if (!token)
                throw new common_1.UnauthorizedException('Unauthorized!');
            token.revoked = true;
            await this.tokenRepo.save(token);
            return { message: 'logged out' };
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async refreshToken(oldToken) {
        try {
            const payload = await this.jwtServ.verify(oldToken, {
                secret: process.env.JWT_REFRESH,
            });
            const { id: userId } = payload;
            const savedInDb = await this.tokenRepo.findOne({ where: { userId } });
            if (!savedInDb || savedInDb.revoked)
                throw new common_1.UnauthorizedException('Unauthorized!');
            if (savedInDb.expiresIn < new Date()) {
                throw new common_1.UnauthorizedException('Refresh token expired!');
            }
            const isMatch = await bcrypt.compare(oldToken, savedInDb.hashedToken);
            if (!isMatch)
                throw new common_1.UnauthorizedException('Unauthorized!');
            savedInDb.revoked = true;
            await this.tokenRepo.save(savedInDb);
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.UnauthorizedException('Unauthorized!');
            const newTokens = this.generateWebTokens({
                id: user.id,
                username: user.username,
                sessionVersion: user.sessionVersion,
            });
            await this.saveToken(newTokens.refreshToken, userId);
            return { newTokens };
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], TokenService);
//# sourceMappingURL=token.service.js.map