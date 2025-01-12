import { Controller, Patch, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthAuthroizedService } from './auth.authroized.service';
import { ResetPasswordDTO } from './auth.authroized.dto';
import { AuthGuard } from 'src/utils/jwt.guard';
import { Request } from 'express';

@Controller('v1/authroized/auth')
@UseGuards(AuthGuard)
export class AuthAuthroizedController {
  constructor(private readonly Authauthroizedservice: AuthAuthroizedService) {}

  @Patch('resetpassword')
  async resetpasswordController(
    @Body() body: ResetPasswordDTO,
    @Req() req: Request,
  ) {
    return this.Authauthroizedservice.resetpasswordService(body, req);
  }

  @Get('@me')
  async meController(@Req() req: Request) {
    return {
      data: req.users,
    };
  }
}
