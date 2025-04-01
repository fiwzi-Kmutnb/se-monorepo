import {
  CanActivate,
  ExecutionContext,
  Injectable,
  // UnauthorizedException,
  // UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WSException } from '@se/customfilter/dist/custom';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token?.split(' ')[1];
    if (!token) {
      throw new WSException({
        message: 'กรุณาทำการเข้าสู่ระบบ',
        type: 'ERROR',
      });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      client.users = decoded;
      console.log(client.users);
      return true;
    } catch (error) {
      throw new WSException({
        message: 'กรุณาทำการเข้าสู่ระบบ',
        type: 'ERROR',
      });
    }
  }
}
