import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameControlService, gameData } from '../service/game-control.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent {
  gameStatus$!: Observable<gameData>;
  constructor(private gameService: GameControlService) {
    this.gameStatus$ = this.gameService.getStats();
  }
}
