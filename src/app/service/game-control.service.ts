import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private currentPlayer: BehaviorSubject<string> = new BehaviorSubject<string>(
    'circle'
  );
  private circle: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private cross: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor() {}

  getCurrentPlayer(): Observable<string> {
    return this.currentPlayer.asObservable();
  }

  switchPlayer(): void {
    this.currentPlayer.next(
      this.currentPlayer.value === 'circle' ? 'cross' : 'circle'
    );
  }

  updatePlayerMoves(value: number) {
    if (this.currentPlayer.value === 'circle') {
      const moves = this.circle.value;
      this.circle.next([...moves, value]);
    } else {
      const moves = this.cross.value;
      this.cross.next([...moves, value]);
    }
  }
}
