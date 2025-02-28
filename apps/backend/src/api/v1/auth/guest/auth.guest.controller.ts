import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthGuestService } from './auth.guest.service';
import {
  LoginDTO,
  ForgotDTO,
  ForgotConfirmPasswordDTO,
  ForgotVerifyDTO,
} from './auth.guest.dto';

@Controller('v1/guest/auth')
export class AuthGuestController {
  constructor(private readonly Authservice: AuthGuestService) {}

  @Post('forgotpassword')
  async forgotpasswordController(@Body() body: ForgotDTO) {
    return this.Authservice.ForgotPassword(body);
  }

  @Post('forgotpassword/:token')
  async forgotpasswordverifyController(@Param() token: ForgotVerifyDTO) {
    return this.Authservice.ForgotPasswordVerify(token);
  }

  @Patch('forgotpassword/:token')
  async forgotpasswordconfirmController(
    @Body() body: ForgotConfirmPasswordDTO,
    @Param() token: ForgotVerifyDTO,
  ) {
    return this.Authservice.ForgotConfirmPassword(body, token);
  }
  @Post('login')
  async loginController(
    @Body()
    body: LoginDTO,
  ) {
    return await this.Authservice.loginService(body);
  }
}
