import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private gameBoard: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    new Array(9)
  );

  constructor() {}

  getGameBoard() {
    return this.gameBoard.asObservable();
  }

  updateGameBoard(index: number) {
    const player = !(this.gameBoard.value.filter((el) => el).length % 2)
      ? 'cross'
      : 'circle';
    const arr = [...this.gameBoard.value];
    arr[index] = player;
    this.gameBoard.next(arr);
  }
}
