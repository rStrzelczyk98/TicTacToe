import { Component } from '@angular/core';
import { GameControlService } from '../service/game-control.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  activeGames: Observable<any>;

  constructor(private gs: GameControlService, private router: Router) {
    this.activeGames = this.gs.getAllGames();
  }

  createGame() {
    this.gs.createNewGame(this.username('host#'));
    this.navigate('game');
  }

  joinGame(id: string) {
    this.gs.joinNewGame(this.username('guest#'), id);
    this.navigate('game');
  }

  private navigate(path: string) {
    this.router.navigate([path]);
  }

  private username(default_name: string) {
    const random = Math.floor(Math.random() * 1000);
    const name = prompt('Enter your name: ');
    return name ? name : default_name + random;
  }
}
