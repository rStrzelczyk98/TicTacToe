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
  @Input() field!: string | null;
  selected!: Observable<string>;
  constructor(private gameControl: GameControlService) {}

  onClick() {
    if (this.field) return;
    this.gameControl.updateBoard(this.index);
    // this.selected = this.gameControl.getSingleMove(this.index);
    // this.gameControl.updateMoves(this.index);
  }
}
