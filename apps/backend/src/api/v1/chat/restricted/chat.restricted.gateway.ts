import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatRestrictedService } from './chat.restricted.service';
import { orderlist, Sendmessage } from '../chat.entity';
import {
  forwardRef,
  Inject,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  AllWsExceptionsFilter,
  WSException
} from '@se/customfilter/dist/custom';
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

  sendMessageToClient(message: string, cusID: string) {
    this.server.emit('new-message', { cusID, message });
  }

  sendOrderToClient(cusID: string, order: orderlist) {
    this.server.emit('new-order', { cusID, order });
  }

  getClient(client: Socket): Socket {
    return client;
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
