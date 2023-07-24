import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  filter,
  map,
  scan,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';

export type Score = {
  [key: string]: number;
};

export type move = {
  field: number;
  player: string;
};

export type gameStream = ReplaySubject<move>;

export type Status = {
  winner: string;
  circle: number;
  cross: number;
  round: number;
  player: string;
  active: boolean;
};
@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private patterns: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  private score: BehaviorSubject<Score> = new BehaviorSubject<Score>({
    cross: 0,
    circle: 0,
  });
  private winner: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private round: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private gameActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  private startWithCross: boolean = true;

  private gameBoard: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
    new Array(9)
  );

  private games$$: BehaviorSubject<gameStream> =
    new BehaviorSubject<gameStream>(new ReplaySubject<move>());

  private activePlayer: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.togglePlayer()
  );

  constructor() {}

  getGameBoard() {
    return this.gameBoard.asObservable();
  }

  getGameStats() {
    return combineLatest([
      this.getWinner(),
      this.getScore('circle'),
      this.getScore('cross'),
      this.round.asObservable(),
      this.activePlayer.asObservable(),
      this.getGameStatus(),
    ]).pipe(
      map(([winner, circle, cross, round, player, active]) => ({
        winner,
        circle,
        cross,
        round,
        player,
        active,
      }))
    );
  }

  reload() {
    this.gameActive.next(true);
    this.updateRound();
    this.startWithCross = !this.startWithCross;
    this.activePlayer.next(this.togglePlayer());
    this.gameBoard.next(new Array(9).fill(Math.random(), 0, 9));
    this.games$$.next(new ReplaySubject<move>());
  }

  private findWinner(moves: move[]) {
    if (this.checkPattern(moves, 'circle')) {
      this.updateScore('circle');
    } else if (this.checkPattern(moves, 'cross')) {
      this.updateScore('cross');
    } else if (moves.length === 9) {
      this.updateScore('');
    }
  }

  private getGameStatus(): Observable<boolean> {
    return this.gameActive.asObservable();
  }

  private getScore(player: string): Observable<number> {
    return this.score.asObservable().pipe(map((score) => score[player]));
  }

  private getWinner(): Observable<string> {
    return this.winner.asObservable();
  }

  private filterPlayer(value: string, moves: move[]) {
    return moves
      .map(({ field, player }) => (player === value ? field + 1 : null))
      .filter((el) => el);
  }

  private updateScore(player: string) {
    if (player) {
      const score = { ...this.score.value };
      ++score[player];
      this.score.next(score);
    }
    this.winner.next(player);
    this.gameActive.next(false);
  }

  private updateRound() {
    let round = this.round.value;
    this.round.next(++round);
  }

  private togglePlayer(): string {
    return this.startWithCross ? 'cross' : 'circle';
  }

  getAllMoves() {
    return this.games$$.pipe(
      switchMap((game$) =>
        game$.pipe(
          scan((acc: move[], curr: move) => (curr ? [...acc, curr] : []), [])
        )
      ),
      shareReplay(1)
    );
  }

  getSingleMove(field: number) {
    return this.getAllMoves().pipe(
      filter((moves) => moves.some((move) => move.field === field)),
      withLatestFrom(this.gameActive),
      tap(([moves, active]) => {
        if (active) this.findWinner(moves);
      }),
      map(
        ([moves, _]) => moves.find((move) => move.field === field)?.player ?? ''
      )
    );
  }

  updateMoves(field: number) {
    this.games$$
      .pipe(
        withLatestFrom(this.activePlayer),
        withLatestFrom(this.gameActive),
        filter(([[_], active]) => active),
        tap(([[game$, player], _]) => {
          game$.next({ field, player });
        }),
        tap(() =>
          this.activePlayer.next(
            this.activePlayer.value === 'cross' ? 'circle' : 'cross'
          )
        ),
        take(1)
      )
      .subscribe();
  }

  private checkPattern(moves: move[], player: string) {
    return this.patterns.some((pattern) =>
      pattern.every((number) =>
        this.filterPlayer(player, moves).includes(number)
      )
    );
  }
}
