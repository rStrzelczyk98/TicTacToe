import { Component } from '@angular/core';
import { GameControlService } from '../service/game-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(private gs: GameControlService, private router: Router) {}
  createGame() {
    this.gs.createNewGame();
    this.navigate('game');
  }

  joinGame() {
    this.gs.joinNewGame();
    this.navigate('game');
  }

  private navigate(path: string) {
    this.router.navigate([path]);
  }
}
