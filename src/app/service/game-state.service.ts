import { Injectable, inject } from '@angular/core';
import { FirebaseService, Moves } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
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

  checkGameState(moves: Moves, player: string): string {
    if (this.checkPattern(moves, player)) return 'winner';
    else if (moves.filter((move) => !move).length === 0) return 'draw';
    else return '';
  }

  private filterPlayer(moves: Moves, player: string): number[] {
    return moves
      .map((move, i) => (move === player ? i + 1 : null))
      .filter((move) => !!move) as number[];
  }

  private checkPattern(moves: Moves, player: string): boolean {
    return this.patterns.some((pattern) =>
      pattern.every((number) =>
        this.filterPlayer(moves, player).includes(number)
      )
    );
  }
}
