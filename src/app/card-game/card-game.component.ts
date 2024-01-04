import { Component } from '@angular/core';

interface Card {
  image: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-card-game',
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.scss']
})
export class CardGameComponent {
  cards: Card[] = [
    { image: './../assets/game1.jpg', flipped: false, matched: false },
    { image: './../assets/game2.jpg', flipped: false, matched: false },
    { image: './../assets/game3.jpg', flipped: false, matched: false },
    { image: './../assets/game1.jpg', flipped: false, matched: false },
    { image: './../assets/game2.jpg', flipped: false, matched: false },
    { image: './../assets/game3.jpg', flipped: false, matched: false },
  ];

  flippedCards: Card[] = [];
  isFlipping: boolean = false;

  flipCard(card: Card) {
    if (!this.isFlipping && !card.flipped && this.flippedCards.length < 2) {
      card.flipped = true;
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        this.isFlipping = true;
        setTimeout(() => {
          this.checkMatch();
          this.isFlipping = false;
        }, 1000);
      }
    }
  }

  checkMatch() {
    if (this.flippedCards[0].image === this.flippedCards[1].image) {
      this.flippedCards.forEach(card => (card.matched = true));
    } else {
      this.flippedCards.forEach(card => (card.flipped = false));
    }

    this.flippedCards = [];
  }
}
