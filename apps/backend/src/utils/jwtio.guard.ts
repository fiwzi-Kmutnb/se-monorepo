import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    // if (!token) {
    //   throw new UnauthorizedException();
    // }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      client.users = decoded;
      return true;
    } catch (error) {
      // throw new UnauthorizedException();
    }
  }
}
