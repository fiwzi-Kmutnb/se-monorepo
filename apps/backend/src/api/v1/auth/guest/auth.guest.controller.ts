import { Body, Controller, Post } from '@nestjs/common';
import { AuthGuestService } from './auth.guest.service';
import { LoginDTO } from './auth.guest.dto';

@Controller('v1/guest/auth')
export class AuthGuestController {
  constructor(private readonly Authservice: AuthGuestService) {}

  // @Get('forgotpassword')
  // async forgotpasswordController(@Body() body: { email: string }) {
  //   return this.Authservice.ForgotPassword(body.email);
  // }

  @Post('login')
  async loginController(
    @Body()
    body: LoginDTO,
  ) {
    return await this.Authservice.loginService(body);
  }
}
