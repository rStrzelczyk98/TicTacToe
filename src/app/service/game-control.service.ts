import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  constructor(private fs: FirebaseService) {}

  getAllGames() {
    return this.fs.getFirebaseCollection();
  }

  getStats() {
    return this.fs.getGameData();
  }

  getBoard() {
    return this.fs.getGameBoard();
  }

  createGame(username: string) {
    this.fs.createNewGame(username);
  }

  joinGame(username: string, id: string) {
    this.fs.joinNewGame(username, id);
  }

  updateBoard(field: number) {
    this.fs.updateGameBoard(field);
  }

  reload() {
    this.fs.reloadGame();
  }

  deleteGame() {
    if (confirm('Do you want to leave the game?')) {
      this.fs.deleteGame();
    }
  }
}
