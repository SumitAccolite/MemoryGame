// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardGameComponent } from './card-game/card-game.component';
import { CardTwelveGameComponent } from './card-twelve-game/card-twelve-game.component';
import { MemoryGameComponent } from './memory-game/memory-game.component';

const routes: Routes = [
  { path: '', component: MemoryGameComponent },
  { path: 'card-game', component: CardGameComponent },
  { path: 'card-twelve-game', component: CardTwelveGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
