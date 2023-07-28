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
import { GameStateService } from './game-state.service';

export type Score = {
  [key: string]: number;
};

export type Moves = (string | null)[];

export type gameData = {
  gameId: string;
  board: Moves;
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
export class FirebaseService {
  private player!: string;
  private gameId!: string;
  private gameData$!: Observable<gameData>;

  constructor(
    private firebase: Firestore,
    private gs: GameStateService,
    private router: Router
  ) {}

  getGameData(): Observable<gameData> {
    return this.gameData$;
  }

  getGameBoard(): Observable<Moves> {
    return this.getGameData().pipe(map(({ board }) => board));
  }

  getFirebaseCollection(): Observable<gameData[]> {
    return collectionData(collection(this.firebase, 'game'), {
      idField: 'gameId',
    }) as Observable<gameData[]>;
  }

  updateGameBoard(field: number) {
    this.gameData$
      .pipe(
        map(({ board, active, player }) => {
          if (active && player === this.player) {
            const moves = board;
            moves[field] = player;
            this.updateGameState(moves);
            this.updatePlayerMoves(moves);
          }
        }),
        take(1)
      )
      .subscribe();
  }

  createNewGame(username: string) {
    const id = String(Date.now());
    this.gameId = id;
    this.player = 'cross';
    setDoc(doc(this.firebase, 'game', this.gameId), {
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
    this.initGame();
  }

  joinNewGame(username: string, gameId: string) {
    this.gameId = gameId;
    this.player = 'circle';
    updateDoc(doc(this.firebase, 'game', this.gameId), {
      circle: username,
    });
    return this.initGame();
  }

  reloadGame() {
    this.gameData$
      .pipe(
        tap(({ round, startWith }) => {
          updateDoc(doc(this.firebase, 'game', this.gameId), {
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
    deleteDoc(doc(this.firebase, 'game', this.gameId));
    this.router.navigate(['']);
  }

  private setWinner() {
    this.gameData$
      .pipe(
        tap(({ score }) => {
          const s = score;
          ++s[this.player];
          updateDoc(doc(this.firebase, 'game', this.gameId), {
            winner: this.player,
            score: s,
            active: false,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  private setDraw() {
    updateDoc(doc(this.firebase, 'game', this.gameId), {
      winner: '',
      active: false,
    });
  }

  private updateGameState(moves: Moves) {
    switch (this.gs.checkGameState(moves, this.player)) {
      case 'winner':
        this.setWinner();
        break;
      case 'draw':
        this.setDraw();
        break;
      default:
        break;
    }
  }

  private updatePlayerMoves(board: Moves) {
    updateDoc(doc(this.firebase, 'game', this.gameId), {
      board,
      player: this.togglePlayer(this.player),
    });
  }

  private initGame() {
    this.gameData$ = this.getFirebaseCollection().pipe(
      tap((games) => {
        if (!this.findGame(games)) this.router.navigate(['']);
      }),
      filter((games) => !!this.findGame(games)),
      map((games) => {
        const {
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
        } = this.findGame(games) as gameData;
        return {
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
        };
      })
    );
  }

  private togglePlayer(player: string): string {
    return player === 'cross' ? 'circle' : 'cross';
  }

  private findGame(games: gameData[]): gameData | undefined {
    return games.find((game) => game['gameId'] === this.gameId);
  }
}
