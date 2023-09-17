export interface Teams {
  home: string;
  away: string;
}

export interface Score {
  home: number;
  away: number;
}

export enum MatchMessages {
  Matches = 'matches',
  EndTime = 'endTime',
}

export interface MatchSimulation {
  type: MatchMessages;
}
