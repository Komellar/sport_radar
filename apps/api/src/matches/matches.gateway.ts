import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MatchesService } from './matches.service';
import { MatchMessages } from './types';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001'],
  },
})
export class MatchesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly matchesService: MatchesService) {}

  handleConnection(client: Socket) {
    console.log(`Connected client: ${client.id}`);

    const matches = this.matchesService.initMatches(client.id);
    this.server.emit('matches', matches);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected client: ${client.id}`);
  }

  @SubscribeMessage('start')
  startSimulation({ id: clientId }: Socket) {
    const observable = this.matchesService.start();

    return observable.subscribe((subscriber) => {
      switch (subscriber.type) {
        case MatchMessages.Matches:
          const updatedMatches = this.matchesService.scoreGoal(clientId);
          this.server.to(clientId).emit(MatchMessages.Matches, updatedMatches);
          break;
        case MatchMessages.EndTime:
          this.server.to(clientId).emit(MatchMessages.EndTime);
          break;
        default:
          break;
      }
    });
  }

  @SubscribeMessage('restart')
  restartSimulation({ id: clientId }: Socket) {
    const matches = this.matchesService.initMatches(clientId);
    this.server.to(clientId).emit('matches', matches);
  }

  @SubscribeMessage('stop')
  stopSimulation() {
    this.matchesService.stop();
  }
}
