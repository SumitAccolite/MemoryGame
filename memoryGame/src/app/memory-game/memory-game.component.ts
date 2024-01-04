// memory-game.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
})
export class MemoryGameComponent {
  constructor(private router: Router) {}

  goToCardGame() {
    this.router.navigate(['/card-game']);
  }

  goToCardTwelveGame() {
    this.router.navigate(['/card-twelve-game']);
  }
}
