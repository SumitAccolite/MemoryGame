// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardGameComponent } from './card-game/card-game.component';
import { CardTwelveGameComponent } from './card-twelve-game/card-twelve-game.component';
import { MemoryGameComponent } from './memory-game/memory-game.component';

@NgModule({
  declarations: [
    AppComponent,
    MemoryGameComponent,
    CardGameComponent,
    CardTwelveGameComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
