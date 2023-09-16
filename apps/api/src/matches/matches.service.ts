import { Injectable } from '@nestjs/common';
import {
  Observable,
  Subject,
  interval,
  map,
  merge,
  takeUntil,
  timer,
} from 'rxjs';

import { Match } from './entities/match.entity';
import { initData } from './constants/initData';
import { MatchMessages, MatchSimulation } from './types';

@Injectable()
export class MatchesService {
  private matches: Match[] = [];
  private stop$ = new Subject<void>();

  initMatches() {
    this.matches = JSON.parse(JSON.stringify(initData));
    return this.matches;
  }

  start(): Observable<MatchSimulation> {
    const endTime$ = timer(10000).pipe(
      map(() => ({ type: MatchMessages.EndTime })),
      takeUntil(this.stop$),
    );

    const goal$ = interval(2000).pipe(
      map((num) => ({
        type: MatchMessages.Matches,
        time: (num + 1) * 3,
      })),
      takeUntil(this.stop$),
    );

    const time$ = interval(1000).pipe(
      map((num) => ({ type: MatchMessages.Time, time: num + 1 })),
      takeUntil(this.stop$),
    );

    return merge(goal$, time$, endTime$);
  }

  stop() {
    this.stop$.next();
  }

  scoreGoal() {
    const matchIndex = Math.floor(Math.random() * this.matches.length);
    const randomTeam = Math.random() > 0.5 ? 'home' : 'away';

    this.matches[matchIndex].score[randomTeam]++;

    return this.matches;
  }
}
