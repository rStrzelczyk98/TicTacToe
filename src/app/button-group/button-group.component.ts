import { Component } from '@angular/core';
import { GameControlService } from '../service/game-control.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent {
  gameStatus$!: Observable<boolean>;
  constructor(private gameService: GameControlService) {}

  reset() {
    this.gameService.reload();
  }
  exit() {
    this.gameService.deleteGame();
  }
}
