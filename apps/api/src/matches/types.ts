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
  Time = 'time',
  EndTime = 'endTime',
}
export interface MatchSimulation {
  type: MatchMessages;
  time?: number;
}
