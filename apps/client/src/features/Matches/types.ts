export interface Match {
  id: string;
  teams: {
    home: string;
    away: string;
  };
  score: {
    home: number;
    away: number;
  };
}
