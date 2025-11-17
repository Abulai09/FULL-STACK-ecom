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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_entity_1 = require("../token/token.entity");
const token_service_1 = require("../token/token.service");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const sms_service_1 = require("../sms/sms.service");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    tokenServ;
    userRepo;
    tokenRepo;
    smsServ;
    redisServ;
    constructor(tokenServ, userRepo, tokenRepo, smsServ, redisServ) {
        this.tokenServ = tokenServ;
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.smsServ = smsServ;
        this.redisServ = redisServ;
    }
    async generateAndSaveToken(user) {
        const payload = {
            id: user.id,
            username: user.username,
            phoneNumber: user.phoneNumber,
            sessionVersion: user.sessionVersion,
            role: user.role,
        };
        const tokens = this.tokenServ.generateWebTokens(payload);
        await this.tokenServ.saveToken(tokens.refreshToken, user.id);
        return tokens;
    }
    async registration(dto) {
        try {
            const candidate = await this.userRepo.findOne({
                where: { username: dto.username },
            });
            if (candidate)
                throw new common_1.BadRequestException('user with this email already exists');
            const hashPassword = await bcrypt.hash(dto.password, 10);
            const user = await this.userRepo.save(this.userRepo.create({
                username: dto.username,
                phoneNumber: dto.phoneNumber,
                password: hashPassword,
                sessionVersion: 1,
                role: dto.role ?? 'user',
            }));
            const tokens = await this.generateAndSaveToken(user);
            return tokens;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async login(phoneNumber, username, password) {
        try {
            const user = await this.userRepo.findOne({ where: { username } });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid password or name!');
            const loginAttemptsKey = `${username}:login_failures`;
            const loginAttemptsStr = await this.redisServ.get(loginAttemptsKey);
            const loginAttempts = parseInt(loginAttemptsStr ?? '0');
            if (loginAttempts >= 5) {
                throw new common_1.UnauthorizedException('Слишком много попыток входа. Попробуйте позже.');
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                await this.redisServ.set(loginAttemptsKey, (loginAttempts + 1).toString(), 60);
                throw new common_1.UnauthorizedException('Invalid password or name!');
            }
            await this.redisServ.del(loginAttemptsKey);
            const existing = await this.redisServ.get(phoneNumber);
            if (existing)
                throw new common_1.BadRequestException('Код уже отправлен, повторите через минуту.');
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            await this.smsServ.sendSMS(phoneNumber, code);
            await this.redisServ.set(username, code, 60);
            return { message: 'Код отправлен' };
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    async verifyLoginCode(username, code) {
        const saved = await this.redisServ.get(username);
        if (!saved)
            throw new common_1.UnauthorizedException('Код не найден или истёк.');
        const attemptsKey = `${username}:attempts`;
        const attemptsStr = await this.redisServ.get(attemptsKey);
        const attempts = parseInt(attemptsStr ?? '0');
        if (attempts >= 3) {
            throw new common_1.UnauthorizedException('Превышено количество попыток.');
        }
        if (saved !== code) {
            await this.redisServ.set(attemptsKey, (attempts + 1).toString(), 60);
            throw new common_1.UnauthorizedException('Неверный код.');
        }
        const user = await this.userRepo.findOne({ where: { username } });
        await this.redisServ.del(username);
        await this.redisServ.del(attemptsKey);
        const tokens = await this.generateAndSaveToken(user);
        return tokens;
    }
    async logOut(userId) {
        try {
            return await this.tokenServ.removeToken(userId);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sms_service_1.SmsService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map