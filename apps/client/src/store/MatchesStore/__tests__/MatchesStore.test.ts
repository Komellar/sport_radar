import { Match, MatchStatus } from "@features/Matches/types";
import { MatchesStore } from "../MatchesStore";

describe("MatchesStore", () => {
  let store: MatchesStore;

  beforeEach(() => {
    store = new MatchesStore();
  });

  it("should initialize with empty matches and NotStarted status", () => {
    expect(store.matches).toEqual([]);
    expect(store.matchStatus).toBe(MatchStatus.NotStarted);
  });

  it("should update matches using setMatches", () => {
    const newMatches: Match[] = [
      {
        id: "1",
        score: { home: 2, away: 1 },
        teams: { home: "teamA", away: "teamB" },
      },
      {
        id: "2",
        score: { home: 0, away: 2 },
        teams: { home: "teamC", away: "teamD" },
      },
    ];

    store.setMatches(newMatches);

    expect(store.matches).toEqual(newMatches);
  });

  it("should update matchStatus using setMatchStatus", () => {
    expect(store.matchStatus).toBe(MatchStatus.NotStarted);
    store.setMatchStatus(MatchStatus.Running);
    expect(store.matchStatus).toBe(MatchStatus.Running);
  });

  it("should calculate totalGoals correctly", () => {
    expect(store.totalGoals).toBe(0);

    const matches: Match[] = [
      {
        id: "1",
        score: { home: 2, away: 1 },
        teams: { home: "teamA", away: "teamB" },
      },
      {
        id: "2",
        score: { home: 0, away: 2 },
        teams: { home: "teamC", away: "teamD" },
      },
      {
        id: "3",
        score: { home: 1, away: 1 },
        teams: { home: "teamE", away: "teamF" },
      },
    ];

    store.setMatches(matches);

    expect(store.totalGoals).toBe(7);
  });
});
