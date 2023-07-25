import { Component } from '@angular/core';
import { GameControlService, Status } from '../service/game-control.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent {
  gameStatus$!: Observable<boolean>;
  constructor(private gameService: GameControlService) {
    this.gameStatus$ = this.gameService
      .getGameStats()
      .pipe(map((status) => status.active));
  }

  reset() {
    this.gameService.reload();
  }
}
