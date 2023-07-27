import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable, map, take, tap } from 'rxjs';

export type Score = {
  [key: string]: number;
};

export type move = {
  field: number;
  player: string;
};

export type Status = {
  winner: string;
  circle: number;
  cross: number;
  round: number;
  player: string;
  active: boolean;
};

export type gameData = {
  board: (string | null)[];
  player: string;
  score: Score;
  winner: string;
  round: number;
  active: boolean;
};
@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  private player!: string;
  // private firestore: Firestore = inject(Firestore);
  private gameData$!: Observable<gameData>;

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

  constructor(private firestore: Firestore) {}

  getStats() {
    return this.gameData$;
  }

  getBoard() {
    return this.gameData$.pipe(map(({ board }) => board));
  }

  createNewGame() {
    this.player = 'cross';
    setDoc(doc(this.firestore, 'game', 'testGame'), {
      board: new Array(9).fill(null, 0, 9),
      player: 'cross',
      score: { cross: 0, circle: 0 },
      winner: '',
      round: 1,
      active: true,
    });
    this.gameInitData();
  }

  joinNewGame() {
    this.player = 'circle';
    this.gameInitData();
  }

  updateBoard(field: number) {
    this.gameData$
      .pipe(
        map(({ board, active, player }) => {
          if (active && player === this.player) {
            const arr = board;
            arr[field] = player;
            this.findWinner(arr, player);
            updateDoc(doc(this.firestore, 'game', 'testGame'), {
              board: arr,
              player: player === 'cross' ? 'circle' : 'cross',
            });
          }
        }),
        take(1)
      )
      .subscribe();
  }

  reload() {
    this.gameData$
      .pipe(
        tap(({ round, winner }) => {
          updateDoc(doc(this.firestore, 'game', 'testGame'), {
            board: new Array(9).fill(null, 0, 9),
            player: winner === 'cross' ? 'circle' : 'cross',
            round: ++round,
            active: true,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  private filterPlayer(value: string, moves: any[]) {
    return moves
      .map((move, i) => (move === value ? i + 1 : null))
      .filter((el) => el);
  }

  private checkPattern(moves: any[], player: string) {
    return this.patterns.some((pattern) =>
      pattern.every((number) =>
        this.filterPlayer(player, moves).includes(number)
      )
    );
  }

  private findWinner(moves: any[], player: string) {
    if (this.checkPattern(moves, player)) {
      this.gameData$
        .pipe(
          tap(({ score }) => {
            const s = score;
            ++s[player];
            updateDoc(doc(this.firestore, 'game', 'testGame'), {
              winner: player,
              score: s,
              active: false,
            });
          }),
          take(1)
        )
        .subscribe();
    } else if (moves.filter((el) => !el).length === 0) {
      updateDoc(doc(this.firestore, 'game', 'testGame'), { winner: '' });
    }
  }

  private gameInitData() {
    this.gameData$ = collectionData(collection(this.firestore, 'game')).pipe(
      map(([{ board, player, score, winner, round, active }]) => ({
        board,
        player,
        score,
        winner,
        round,
        active,
      }))
    );
  }
}
