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
import { orderformat, Sendmessage } from '../chat.entity';
import { forwardRef, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { AllWsExceptionsFilter } from '@se/customfilter/dist/custom';
import { WsGuard } from 'src/utils/jwtio.guard';

@WebSocketGateway({ namespace: 'chat' })
export class ChatRestrictedGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private clients = new Set<Socket>();

  @WebSocketServer() server: Server;
  constructor(
    @Inject(forwardRef(() => ChatRestrictedService))
    private readonly chatrestrictedservice: ChatRestrictedService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  sendMessageToClient(message: string, cusID: string, type: string) {
    this.server.emit('new-message', { cusID, message, type });
  }

  sendOrderToClient(cusID: string, Neworder: orderformat) {
    this.server.emit('new-order', { cusID, Neworder });
  }

  @UseGuards(WsGuard)
  @UseFilters(AllWsExceptionsFilter)
  @SubscribeMessage('sendmessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Sendmessage,
  ) {
    client.emit(
      'sendmessage',
      this.chatrestrictedservice.SendMessageService(payload, client),
    );
  }
}
