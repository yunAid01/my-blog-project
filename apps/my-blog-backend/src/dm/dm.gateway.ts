// apps/my-blog-backend/src/dm/dm.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';

@WebSocketGateway({ cors: true }) // 모든 출처의 소켓 연결 허용 (개발용)
export class DmGateway {
  @WebSocketServer()
  server: Server; // 1. 서버 객체 (모든 클라이언트에게 방송)

  constructor(private readonly dmService: DmService) {}

  // 2. "sendMessage"라는 이름표가 붙은 메시지를 받으면 이 함수가 실행됨
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: {
      senderId: number;
      conversationId: number;
      createDmDto: CreateDmDto;
    },
    @ConnectedSocket() client: Socket, // 3. 메시지를 보낸 '그 클라이언트'
  ) {
    // 4. (중요) 받은 메시지를 먼저 DB에 저장합니다 (Service 재활용)
    const newMessage = await this.dmService.createMessage(
      payload.senderId, // (임시: 나중엔 client.data.user.id에서 가져와야 함)
      payload.conversationId,
      payload.createDmDto
    );

    // 5. (중요) 이 메시지를 "receiveMessage"라는 이름표로 '모든' 클라이언트에게 전송
    this.server.emit('receiveMessage', newMessage);

    // (참고: 나중에는 .to(방이름)을 써서 특정 방에만 보낼 수 있습니다)
  }
}