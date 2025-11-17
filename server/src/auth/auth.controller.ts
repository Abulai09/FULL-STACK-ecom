import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from 'src/token/token.service';
import { userDto } from './dto/userDto';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServ: AuthService,
    private readonly tokenServ: TokenService,
  ) {}

  @Post('registration')
  async registration(@Body() dto: userDto, @Res({ passthrough: true }) res) {
    const userDat = await this.authServ.registration(dto);

    res.cookie('refreshToken', userDat.refreshToken, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { accessToken: userDat.accessToken };
  }

  @Post('login')
  async login(
    @Body() body: { phoneNumber: string; username: string; password: string },
  ) {
    const userDat = await this.authServ.login(
      body.phoneNumber,
      body.username,
      body.password,
    );
    return { message: userDat.message };
  }

  @Post('verify')
  async verifyLoginCode(
    @Body() body: { username: string; code: string },
    @Res({ passthrough: true }) res,
  ) {
    const userDat = await this.authServ.verifyLoginCode(
      body.username,
      body.code,
    );

    res.cookie('refreshToken', userDat.refreshToken, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken: userDat.accessToken };
  }

  @Post('logOut')
  @UseGuards(JwtAuthGuard)
  async logOut(@Req() req, @Res({ passthrough: true }) res) {
    const userId = req.user.id;

    res.clearCookie('refreshToken');

    return await this.authServ.logOut(userId);
  }

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
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
}
