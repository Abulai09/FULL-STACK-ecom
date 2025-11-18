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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDto = void 0;
const class_validator_1 = require("class-validator");
class userDto {
    username;
    phoneNumber;
    password;
    role;
}
exports.userDto = userDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'min 3' }),
    __metadata("design:type", String)
], userDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)('KZ'),
    (0, class_validator_1.MinLength)(11, { message: 'min 11' }),
    __metadata("design:type", String)
], userDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'min 3' }),
    __metadata("design:type", String)
], userDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'min 3' }),
    __metadata("design:type", String)
], userDto.prototype, "role", void 0);
//# sourceMappingURL=userDto.js.map