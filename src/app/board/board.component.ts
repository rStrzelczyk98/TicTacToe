import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameControlService } from '../service/game-control.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  gameBoard$: Observable<string[]>;

  constructor(private gameControl: GameControlService) {
    this.gameBoard$ = this.gameControl.getGameBoard();
  }
}
