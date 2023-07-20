import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, scan } from 'rxjs';

export type move = {
  field: number;
  player: string;
};
@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private gameBoard: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    new Array(9)
  );
  private moves: BehaviorSubject<move> = new BehaviorSubject<move>({} as move);
  private startWithCross: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  constructor() {}

  getGameBoard() {
    return this.gameBoard.asObservable();
  }

  getAllMoves(): Observable<move[]> {
    return this.moves
      .asObservable()
      .pipe(
        scan(
          (acc: move[], curr: move) =>
            curr.field === undefined ? [...acc] : [...acc, curr],
          []
        )
      );
  }

  getPlayerMove(index: number): Observable<string> {
    return this.getAllMoves().pipe(
      filter((moves) => moves.some((move) => move.field === index)),
      map(
        (moves) => moves[moves.findIndex((move) => move.field === index)].player
      )
    );
  }

  updateGameBoard(index: number) {
    let player: string;
    if (this.moves.value.player === undefined) {
      player = this.startWithCross.value ? 'cross' : 'circle';
    } else if (this.moves.value.player === 'cross') {
      player = 'circle';
    } else {
      player = 'cross';
    }
    this.moves.next({ field: index, player });
  }
}
