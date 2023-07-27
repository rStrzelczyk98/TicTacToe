import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameControlService, gameData } from '../service/game-control.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  gameBoard$: Observable<(string | null)[]>;

  constructor(private gameControl: GameControlService) {
    this.gameBoard$ = this.gameControl.getBoard();
  }
}
