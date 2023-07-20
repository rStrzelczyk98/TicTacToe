import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { GameControlService } from 'src/app/service/game-control.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() index!: number;
  selected$!: Observable<string>;
  constructor(private gameControl: GameControlService) {}

  onClick() {
    if (this.selected$) return;
    this.gameControl.updateGameBoard(this.index);
    this.selected$ = this.gameControl.getPlayerMove(this.index);
  }
}
