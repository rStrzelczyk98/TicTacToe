import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Players = {
  [key: string]: number;
};

@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private board: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
    new Array(9)
  );
  private moves: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  getBoard() {
    return this.board.asObservable();
  }

  constructor() {}

  updateMoves(value: number) {
    this.moves.value.push(value);
  }

  getCurrentPlayer() {
    return this.moves.asObservable();
  }
}
