import { Component, Input } from '@angular/core';
import { Observable, Subscription, first, tap } from 'rxjs';
import { GameControlService } from 'src/app/service/game-control.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() value!: number;
  selected: string = '';
  currentPlayer$: Observable<string>;

  constructor(private gameControl: GameControlService) {
    this.currentPlayer$ = this.gameControl.getCurrentPlayer();
  }

  onClick() {
    if (this.selected) return;
    this.gameControl.updatePlayerMoves(this.value);
    this.gameControl
      .getCurrentPlayer()
      .pipe(first())
      .subscribe((data) => (this.selected = data));
    this.gameControl.switchPlayer();
  }
}
