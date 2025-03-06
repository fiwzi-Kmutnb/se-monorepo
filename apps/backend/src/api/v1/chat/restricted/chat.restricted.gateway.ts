import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatRestrictedService } from './chat.restricted.service';
import { Sendmessage } from '../chat.entity';
import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { WsGuard } from 'src/utils/jwtio.guard';
import { TransformInterceptor } from '@se/custominterceptor';
import {
  AllWsExceptionsFilter,
  WSException,
} from '@se/customfilter/dist/custom';

@WebSocketGateway({ namespace: 'chat' })
// @UseFilters(AllWsExceptionsFilter)
export class ChatRestrictedGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly chatrestrictedservice: ChatRestrictedService) {}
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // @UseGuards(WsGuard)
  // @UseInterceptors(TransformInterceptor)
  @SubscribeMessage('sendmessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Sendmessage,
  ) {
    client.emit(
      'sendmessage',
      this.chatrestrictedservice.SendMessageService(payload),
    );
  }
}
