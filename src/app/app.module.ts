import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoreComponent } from './score/score.component';
import { WinnerComponent } from './score/winner/winner.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './board/card/card.component';

@NgModule({
  declarations: [AppComponent, ScoreComponent, WinnerComponent,
    ButtonGroupComponent, BoardComponent, CardComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
