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

    const matches = this.matchesService.initMatches();
    this.server.emit('matches', matches);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected client: ${client.id}`);
  }

  @SubscribeMessage('start')
  startSimulation() {
    const observable = this.matchesService.start();

    return observable.subscribe((subscriber) => {
      switch (subscriber.type) {
        case MatchMessages.Matches:
          const updatedMatches = this.matchesService.scoreGoal();
          this.server.emit(MatchMessages.Matches, updatedMatches);
          break;
        case MatchMessages.Time:
          this.server.emit(MatchMessages.Time, subscriber.time);
          break;
        case MatchMessages.EndTime:
          this.matchesService.stop();
          this.server.emit(MatchMessages.EndTime);
          break;
        default:
          break;
      }
    });
  }

  @SubscribeMessage('restart')
  restartSimulation() {
    const matches = this.matchesService.initMatches();
    this.server.emit('matches', matches);
  }

  @SubscribeMessage('stop')
  stopSimulation() {
    this.matchesService.stop();
  }
}
