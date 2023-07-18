import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameControlService } from '../service/game-control.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  boardFields: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  currentPlayer$: Observable<string>;

  constructor(private gameControl: GameControlService) {
    this.currentPlayer$ = this.gameControl.getCurrentPlayer();
  }
}
