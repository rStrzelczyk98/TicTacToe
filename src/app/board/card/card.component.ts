import { Component, Input } from '@angular/core';
import { Observable, first, map } from 'rxjs';
import { GameControlService } from 'src/app/service/game-control.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() value!: number;
  selected!: Observable<string>;
  constructor(private gameControl: GameControlService) {}

  onClick() {
    if (this.selected) return;
    this.selected = this.gameControl.getCurrentPlayer().pipe(
      map((arr) => (arr.length % 2 ? 'circle' : 'cross')),
      first()
    );
    this.gameControl.updateMoves(this.value);
  }
}
