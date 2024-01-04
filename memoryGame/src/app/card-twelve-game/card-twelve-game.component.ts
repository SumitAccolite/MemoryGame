import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Card {
  image: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-card-twelve-game',
  templateUrl: './card-twelve-game.component.html',
  styleUrls: ['./card-twelve-game.component.scss'],
})
export class CardTwelveGameComponent {
  private router = inject(Router);
  cards: Card[] = [
    { image: './../assets/game1.png', flipped: false, matched: false },
    { image: './../assets/game2.png', flipped: false, matched: false },
    { image: './../assets/game3.png', flipped: false, matched: false },
    { image: './../assets/game4.jpg', flipped: false, matched: false },
    { image: './../assets/game1.png', flipped: false, matched: false },
    { image: './../assets/game2.png', flipped: false, matched: false },
    { image: './../assets/game5.png', flipped: false, matched: false },
    { image: './../assets/game6.jpg', flipped: false, matched: false },
    { image: './../assets/game3.png', flipped: false, matched: false },
    { image: './../assets/game4.jpg', flipped: false, matched: false },
    { image: './../assets/game5.png', flipped: false, matched: false },
    { image: './../assets/game6.jpg', flipped: false, matched: false },
  ];

  flippedCards: Card[] = [];
  isFlipping: boolean = false;

  score: number = 0;
  moves: number = 0;
  misses: number = 0;
  accuracy: number = 0;
  totalCards: number = this.cards.length;
  showWinMessage: boolean = false;

  flipCard(card: Card) {
    if (!this.isFlipping && !card.flipped && this.flippedCards.length < 2) {
      card.flipped = true;
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        this.isFlipping = true;
        setTimeout(() => {
          this.checkMatch();
          this.isFlipping = false;
          this.moves++;

          if (this.isGameFinished()) {
            this.calculateAccuracy();
          }
        }, 2000);
      }
    }
  }

  checkMatch() {
    if (this.flippedCards[0].image === this.flippedCards[1].image) {
      this.flippedCards.forEach((card) => (card.matched = true));
      this.score += 100;
       if (this.moves == this.totalCards / 2) {
         this.showWinMessage = true;
       }
    } else {
      this.flippedCards.forEach((card) => (card.flipped = false));
      this.misses++;
    }

    this.flippedCards = [];
  }

  isGameFinished(): boolean {
    return this.cards.every((card) => card.matched);
  }

  calculateAccuracy() {
    const totalMoves = this.moves + this.misses;
    if (totalMoves > 0) {
      this.accuracy = (this.moves / totalMoves) * 100;
    }
  }
  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}
