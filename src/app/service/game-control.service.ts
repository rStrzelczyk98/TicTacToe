import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, filter, map, take, tap } from 'rxjs';

export type Score = {
  [key: string]: number;
};

export type gameData = {
  gameId: string;
  board: (string | null)[];
  cross: string;
  circle: string;
  player: string;
  startWith: string;
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
  private gameId!: string;
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

  constructor(private firestore: Firestore, private router: Router) {}

  getAllGames() {
    return collectionData(collection(this.firestore, 'game'), {
      idField: 'gameId',
    });
  }

  getStats() {
    return this.gameData$;
  }

  getBoard() {
    return this.gameData$.pipe(map(({ board }) => board));
  }

  createNewGame(username: string) {
    const id = String(Date.now());
    this.gameId = id;
    this.player = 'cross';
    setDoc(doc(this.firestore, 'game', id), {
      board: new Array(9).fill(null, 0, 9),
      cross: username,
      circle: 'guest',
      player: 'cross',
      startWith: 'cross',
      score: { cross: 0, circle: 0 },
      winner: '',
      round: 1,
      active: true,
    });
    this.gameInitData();
  }

  joinNewGame(username: string, id: string) {
    this.player = 'circle';
    this.gameId = id;
    updateDoc(doc(this.firestore, 'game', this.gameId), {
      circle: username,
    });
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
            updateDoc(doc(this.firestore, 'game', this.gameId), {
              board: arr,
              player: this.togglePlayer(player),
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
        tap(({ round, startWith }) => {
          updateDoc(doc(this.firestore, 'game', this.gameId), {
            board: new Array(9).fill(null, 0, 9),
            player: this.togglePlayer(startWith),
            startWith: this.togglePlayer(startWith),
            round: ++round,
            active: true,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  deleteGame() {
    if (confirm('Do you want to leave the game?')) {
      deleteDoc(doc(this.firestore, 'game', this.gameId));
      this.router.navigate(['']);
    }
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
            updateDoc(doc(this.firestore, 'game', this.gameId), {
              winner: player,
              score: s,
              active: false,
            });
          }),
          take(1)
        )
        .subscribe();
    } else if (moves.filter((el) => !el).length === 0) {
      updateDoc(doc(this.firestore, 'game', this.gameId), {
        winner: '',
        active: false,
      });
    }
  }

  private togglePlayer(player: string) {
    return player === 'cross' ? 'circle' : 'cross';
  }

  private gameInitData() {
    this.gameData$ = this.getAllGames().pipe(
      tap((data) => {
        if (!data.length) this.router.navigate(['']);
      }),
      filter((data) => data.length !== 0),
      map(
        ([
          {
            gameId,
            board,
            cross,
            circle,
            player,
            startWith,
            score,
            winner,
            round,
            active,
          },
        ]) => ({
          gameId,
          board,
          cross,
          circle,
          player,
          startWith,
          score,
          winner,
          round,
          active,
        })
      )
    );
  }
}
