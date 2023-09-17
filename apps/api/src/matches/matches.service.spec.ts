import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { MatchMessages } from './types';

jest.mock('./constants/time', () => ({
  MATCH_TIME: 200,
  GOAL_INTERVAL: 100,
}));

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMatches', () => {
    it('should return matches of specific client', () => {
      const clientId = 'testClientId';
      const matches: Match[] = service.initMatches(clientId);
      expect(service.getMatches(clientId)).toBe(matches);
    });
    it('should return empty array if client has no matches', () => {
      const clientId = 'testClientId';
      expect(service.getMatches(clientId)).toEqual([]);
    });
  });

  describe('initMatches', () => {
    it('should initialize matches for a client', () => {
      const clientId = 'testClientId';
      const matches: Match[] = service.initMatches(clientId);

      expect(matches).toBeDefined();
      expect(service.getMatches(clientId)).toEqual(matches);
    });
  });

  describe('start', () => {
    it('should emit MatchMessages.Matches and MatchMessages.EndTime messages', (done) => {
      const messagesReceived: string[] = [];

      const subscription = service.start().subscribe((message) => {
        messagesReceived.push(message.type);

        // If both messages are received, complete the test
        if (
          messagesReceived.includes(MatchMessages.Matches) &&
          messagesReceived.includes(MatchMessages.EndTime)
        ) {
          subscription.unsubscribe();
          done();
        }
      });
    });
  });

  describe('stop', () => {
    it('should be defined', () => {
      expect(service.stop).toBeDefined();
    });
  });

  describe('scoreGoal', () => {
    it('should increment the score of a random match', () => {
      const clientId = 'testClientId';
      const matches: Match[] = service.initMatches(clientId);

      const initialMatches = JSON.parse(JSON.stringify(matches));

      service.scoreGoal(clientId);

      let goalScored = false;
      for (let i = 0; i < matches.length; i++) {
        if (
          matches[i].score.home > initialMatches[i].score.home ||
          matches[i].score.away > initialMatches[i].score.away
        ) {
          goalScored = true;
          break;
        }
      }

      expect(goalScored).toBe(true);
    });
  });
});
