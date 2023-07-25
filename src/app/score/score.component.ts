import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameControlService, Status } from '../service/game-control.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent {
  gameStatus$!: Observable<Status>;
  constructor(private gameService: GameControlService) {
    this.gameStatus$ = this.gameService.getGameStats();
  }
}
