import { Injectable } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { Subject, interval, map, merge, takeUntil, timer } from 'rxjs';
import { initData } from './constants/initData';

@Injectable()
export class MatchesService {
  private matches: Match[] = [];
  private stop$ = new Subject<void>();

  initMatches() {
    this.matches = JSON.parse(JSON.stringify(initData));
    return this.matches;
  }

  start() {
    timer(10000).subscribe(() => this.stop$.next());

    const goal$ = interval(2000).pipe(
      map((num) => ({ type: 'goal', time: (num + 1) * 3 })),
      takeUntil(this.stop$),
    );

    const time$ = interval(1000).pipe(
      map((num) => ({ type: 'time', time: num + 1 })),
      takeUntil(this.stop$),
    );

    return merge(goal$, time$);
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
