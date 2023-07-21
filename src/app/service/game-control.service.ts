import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  ReplaySubject,
  filter,
  map,
  scan,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';

export type move = {
  field: number;
  player: string;
};
export type gameStream = ReplaySubject<move>;
@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private startWithCross: boolean = true;

  private gameBoard: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
    new Array(9)
  );

  private games$$: BehaviorSubject<gameStream> =
    new BehaviorSubject<gameStream>(new ReplaySubject<move>());

  private activePlayer: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.togglePlayer()
  );

  getGameBoard() {
    return this.gameBoard.asObservable();
  }

  getAllMoves() {
    return this.games$$.pipe(
      switchMap((game$) =>
        game$.pipe(
          scan(
            (acc: move[], curr: move) =>
              curr.field === undefined ? [] : [...acc, curr],
            []
          )
        )
      )
    );
  }

  getSingleMove(field: number) {
    return this.getAllMoves().pipe(
      filter((moves) => moves.some((move) => move.field === field)),
      map(
        (moves) => moves[moves.findIndex((move) => move.field === field)].player
      )
    );
  }

  updateMoves(field: number) {
    this.games$$
      .pipe(
        withLatestFrom(this.activePlayer),
        tap(([game$, player]) => {
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

  private togglePlayer(): string {
    return this.startWithCross ? 'cross' : 'circle';
  }
}
