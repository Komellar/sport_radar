import { Test, TestingModule } from '@nestjs/testing';
import { MatchesGateway } from './matches.gateway';
import { MatchesService } from './matches.service';
import { Server, Socket } from 'socket.io';
import { Observable, of } from 'rxjs';
import { MatchMessages, MatchSimulation } from './types';

describe('MatchesGateway', () => {
  let gateway: MatchesGateway;
  let matchesService: MatchesService;
  let server: Server;
  let socket: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesGateway, MatchesService],
    }).compile();

    gateway = module.get<MatchesGateway>(MatchesGateway);
    matchesService = module.get<MatchesService>(MatchesService);

    server = {
      to: jest.fn(() => server),
      emit: jest.fn(),
    } as any;

    gateway.server = server;

    socket = {
      id: 'testClientId',
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should emit matches', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const initMatchesMock = jest
        .spyOn(matchesService, 'initMatches')
        .mockReturnValue([]);

      gateway.handleConnection(socket);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connected client: testClientId',
      );
      expect(initMatchesMock).toHaveBeenCalledWith('testClientId');
      expect(server.emit).toHaveBeenCalledWith('matches', []);
    });
  });

  describe('handleDisconnect', () => {
    it('should log disconnection', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      gateway.handleDisconnect(socket);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Disconnected client: testClientId',
      );
    });
  });

  describe('startSimulation', () => {
    it('should subscribe to matchesService and score a goal', () => {
      const matches$ = of({ type: MatchMessages.Matches });
      const startMock = jest
        .spyOn(matchesService, 'start')
        .mockReturnValue(matches$);

      const scoreGoalMock = jest
        .spyOn(matchesService, 'scoreGoal')
        .mockReturnValue([
          {
            id: 'id-1',
            score: { home: 0, away: 1 },
            teams: { home: 'a', away: 'b' },
          },
        ]);

      gateway.startSimulation(socket);

      expect(startMock).toHaveBeenCalled();
      expect(scoreGoalMock).toHaveBeenCalled();

      expect(server.to).toHaveBeenCalledWith('testClientId');
      expect(server.emit).toHaveBeenCalledWith(
        MatchMessages.Matches,
        expect.anything(),
      );
    });

    it('should subscribe to matchesService and end match', () => {
      const endTime$ = of({ type: MatchMessages.EndTime });
      const startMock = jest
        .spyOn(matchesService, 'start')
        .mockReturnValue(endTime$);

      gateway.startSimulation(socket);

      expect(startMock).toHaveBeenCalled();
      expect(server.to).toHaveBeenCalledWith('testClientId');
      expect(server.emit).toHaveBeenCalledWith(MatchMessages.EndTime);
    });

    it('should do nothing if observable returns not matching type', () => {
      const endTime$ = of({ type: 'badType' });
      const startMock = jest
        .spyOn(matchesService, 'start')
        .mockReturnValue(endTime$ as unknown as Observable<MatchSimulation>);

      gateway.startSimulation(socket);

      expect(startMock).toHaveBeenCalled();
      expect(server.to).not.toHaveBeenCalled;
      expect(server.emit).not.toHaveBeenCalled;
    });
  });

  describe('restartSimulation', () => {
    it('should emit matches', () => {
      const initMatchesMock = jest
        .spyOn(matchesService, 'initMatches')
        .mockReturnValue([]);

      gateway.restartSimulation(socket);

      expect(initMatchesMock).toHaveBeenCalledWith('testClientId');
      expect(server.to).toHaveBeenCalledWith('testClientId');
      expect(server.emit).toHaveBeenCalledWith('matches', []);
    });
  });

  describe('stopSimulation', () => {
    it('should call matchesService.stop', () => {
      const stopMock = jest.spyOn(matchesService, 'stop');
      gateway.stopSimulation();
      expect(stopMock).toHaveBeenCalled();
    });
  });
});
