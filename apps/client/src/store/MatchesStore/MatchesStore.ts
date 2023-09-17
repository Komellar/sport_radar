import { makeAutoObservable } from "mobx";

import { Match, MatchStatus } from "@features/Matches/types";
import { StoreData } from "./types";

class MatchesStore {
  private data: StoreData = {
    matches: [],
    matchStatus: MatchStatus.NotStarted,
  };

  constructor() {
    makeAutoObservable(this);
  }

  get matches() {
    return this.data.matches;
  }

  get matchStatus() {
    return this.data.matchStatus;
  }

  get totalGoals() {
    return this.data.matches.reduce((sum, { score }) => {
      return sum + score.away + score.home;
    }, 0);
  }

  setMatches(matches: Match[]): void {
    this.data.matches = matches;
  }

  setMatchStatus(status: MatchStatus) {
    this.data.matchStatus = status;
  }
}

export const matchesStore = new MatchesStore();
