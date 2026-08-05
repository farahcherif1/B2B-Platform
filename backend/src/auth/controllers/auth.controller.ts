import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Auth, Access } from '../core/decorators/auth.decorator';
import { AuthGuard } from '../core/guards/auth.guard';
import { GetUser } from '../core/decorators/get-user.decorator';
import { Organaizer } from '../core/decorators/organizer.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('register/organizer')
  async registerOrganizer(
    @Body() body: { name: string; email: string; password: string },
  ) {
    const { ...resultat } = this.authService.registerOrganizer(
      body.name,
      body.email,
      body.password,
    );
    return resultat;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('login/organizer')
  async loginOrganizer(@Body() body: { email: string; password: string }) {
    return this.authService.loginOrganizer(body.email, body.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@GetUser() user) {
    return 'Profile';
  }
  @Post('inviteOrganizer')
  async inviteOrganizer(
    @Body() body: { email: string; eventId: number; role: string },
  ) {
    await this.authService.inviteOrganizer(body);
    return { message: 'Organizer invited successfully' };
  }

  @Get('organizer')
  @Organaizer()
  async org() {
    return 'Profile';
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendEmailResetPassword(body.email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body() body: { password: string },
    @Param('token') token: string,
  ) {
    return this.authService.resetPassword(token, body.password);
  }
}
