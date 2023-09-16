import { v4 as uuid } from 'uuid';
import { Match } from '../entities/match.entity';
import { Score, Teams } from '../types';

const teams: Teams[] = [
  { home: 'Germany', away: 'Poland' },
  { home: 'Brazil', away: 'Mexico' },
  { home: 'Argentina', away: 'Uruguay' },
];

const initScore: Score = {
  home: 0,
  away: 0,
};

export const initData: Match[] = teams.map((matchTeams) => ({
  id: uuid(),
  teams: matchTeams,
  score: initScore,
}));
