import { Match, MatchStatus } from "@features/Matches/types";

export interface StoreData {
  matches: Match[];
  matchStatus: MatchStatus;
}
