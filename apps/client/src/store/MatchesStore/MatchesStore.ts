import { makeAutoObservable } from "mobx";

import { Match, MatchStatus } from "@features/Matches/types";

class MatchesStore {
  matches: Match[] = [];
  matchTime: number = 0;
  matchStatus: MatchStatus = MatchStatus.NotStarted;

  constructor() {
    makeAutoObservable(this);
  }

  setMatches(matches: Match[]): void {
    this.matches = matches;
  }

  setTime(time: number): void {
    this.matchTime = time;
  }

  setMatchStatus(status: MatchStatus) {
    this.matchStatus = status;
  }
}

export const matchesStore = new MatchesStore();
