import { Injectable } from '@nestjs/common';
import {
  Observable,
  Subject,
  interval,
  map,
  mergeWith,
  takeUntil,
  takeWhile,
  timer,
} from 'rxjs';

import { Match } from './entities/match.entity';
import { initData } from './constants/initData';
import { MatchMessages, MatchSimulation } from './types';
import { GOAL_INTERVAL, MATCH_TIME } from './constants/time';

@Injectable()
export class MatchesService {
  private matches: Record<string, Match[]> = {};
  private stop$ = new Subject<void>();

  initMatches(clientId: string): Match[] {
    this.matches[clientId] = JSON.parse(JSON.stringify(initData));
    return this.matches[clientId];
  }

  start(): Observable<MatchSimulation> {
    const endTime$ = timer(MATCH_TIME).pipe(
      takeUntil(this.stop$),
      map(() => ({ type: MatchMessages.EndTime })),
    );

    const goal$ = interval(GOAL_INTERVAL).pipe(
      takeWhile((num) => num * 1000 < MATCH_TIME),
      takeUntil(this.stop$),
      map(() => ({ type: MatchMessages.Matches })),
    );

    return goal$.pipe(mergeWith(endTime$));
  }

  stop(): void {
    this.stop$.next();
  }

  scoreGoal(clientId: string): Match[] {
    const matchIndex = Math.floor(
      Math.random() * this.matches[clientId].length,
    );
    const randomTeam = Math.random() > 0.5 ? 'home' : 'away';

    this.matches[clientId][matchIndex].score[randomTeam]++;

    return this.matches[clientId];
  }
}
