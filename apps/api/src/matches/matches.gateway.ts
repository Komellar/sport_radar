import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { MatchesService } from './matches.service';
import { Server, Socket } from 'socket.io';

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
      if (subscriber.type === 'goal') {
        const updatedMatches = this.matchesService.scoreGoal();
        this.server.emit('matches', updatedMatches);
      } else {
        this.server.emit('time', subscriber.time);
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
