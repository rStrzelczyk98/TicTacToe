import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  shareReplay,
} from 'rxjs';

export type Score = {
  [key: string]: number;
};

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

  private gameBoard: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    new Array(9)
  );
  private score: BehaviorSubject<Score> = new BehaviorSubject<Score>({
    cross: 0,
    circle: 0,
  });
  private winner: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private round: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private gameActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
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
      this.gameBoard
        .asObservable()
        .pipe(
          map((field) =>
            !(field.filter((value) => value).length % 2) ? 'cross' : 'circle'
          )
        ),
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

  updateGameBoard(index: number) {
    if (!this.gameActive.value) return;
    const player = this.getCurrentPlayer();
    const arr = [...this.gameBoard.value];
    arr[index] = player;
    this.gameBoard.next(arr);
    this.findPattern();
  }

  findPattern() {
    this.patterns.find((pattern) => {
      if (pattern.every((value) => this.filterPlayer('circle').includes(value)))
        this.updateScore('circle');
      else if (
        pattern.every((value) => this.filterPlayer('cross').includes(value))
      )
        this.updateScore('cross');
      else if (this.gameBoard.value.every((el) => el) && this.gameActive.value)
        this.updateScore('');
    });
  }

  reload() {
    this.gameBoard.next(new Array(9));
    this.gameActive.next(true);
    this.updateRound();
  }

  getCurrentPlayer(): string {
    return !(this.gameBoard.value.filter((el) => el).length % 2)
      ? 'cross'
      : 'circle';
  }

  private getGameStatus() {
    return this.gameActive.asObservable();
  }

  private getScore(player: string) {
    return this.score.asObservable().pipe(map((score) => score[player]));
  }

  private getWinner(): Observable<string> {
    return this.winner.asObservable();
  }

  private filterPlayer(value: string) {
    return this.gameBoard.value
      .map((player, index) => (player === value ? index + 1 : null))
      .filter((el) => el !== null);
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
}
