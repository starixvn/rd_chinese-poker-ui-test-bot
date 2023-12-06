const cardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["spades", "clubs", "diamonds", "hearts"];

let straights: string[] = [];
for (let i = 0; i < 9; i++) {
  let straight = "";
  for (let j = 0; j < 5; j++) {
    straight += cardRanks[j + i];
  }
  straights.push(straight);
}
straights.push("2345A");

let cardNames: string[] = [];
cardRanks.forEach((rank) => {
  suits.forEach((suit) => {
    cardNames.push(`${rank}:${suit}`);
  });
});

export const HandTypes = {
  HighCard: "High Card",
  Pair: "Pair",
  TwoPairs: "Two Pairs",
  ThreeOfKinds: "Three Of Kinds",
  FourOfKinds: "Four Of Kinds",
  Straight: "Straight",
  Flush: "Flush",
  FullHouse: "Full House",
  StraightFlush: "Straight Flush",
  RoyalFlush: "Royal Flush",
};

export class TypeChecker {
  private ranks: string[];
  private setRanks: Set<string>;
  private setSuits: Set<string>;

  constructor(cards: number[]) {
    cards.sort((n1, n2) => n1 - n2);
    this.ranks = cards.map((x) => cardNames[x].split(":")[0]);
    this.setRanks = new Set(this.ranks);
    this.setSuits = new Set(cards.map((x) => cardNames[x].split(":")[1]));
  }

  public getType(): string {
    if (this.isFullHouseOrFourOfKinds()) {
      return this.isFourOfKinds() ? HandTypes.FourOfKinds : HandTypes.FullHouse;
    }
    if (this.isTwoPairsOrThreeOfKinds()) {
      return this.isThreeOfKinds() ? HandTypes.ThreeOfKinds : HandTypes.TwoPairs;
    }
    if (this.isPair()) {
      return HandTypes.Pair;
    }
    if (this.isStraightFlush()) {
      return this.isRoyalFlush() ? HandTypes.RoyalFlush : HandTypes.StraightFlush;
    }
    if (this.isStraight()) {
      return HandTypes.Straight;
    }
    if (this.isFlush()) {
      return HandTypes.Flush;
    }
    return HandTypes.HighCard;
  }

  private isPair(): boolean {
    return this.ranks.length - this.setRanks.size === 1;
  }

  private isTwoPairsOrThreeOfKinds(): boolean {
    return this.ranks.length - this.setRanks.size === 2;
  }

  private isThreeOfKinds(): boolean {
    let result = false;
    this.ranks.forEach((r) => {
      if (this.ranks.filter((x) => x === r).length === 3) {
        result = true;
      }
    });
    return result;
  }

  private isStraight(): boolean {
    const rankString = this.ranks.join("");
    return straights.indexOf(rankString) > -1;
  }

  private isFlush(): boolean {
    return this.setSuits.size == 1;
  }

  private isFullHouseOrFourOfKinds(): boolean {
    return this.setRanks.size === 2 && this.ranks.length === 5;
  }

  private isFourOfKinds(): boolean {
    let result = false;
    this.ranks.forEach((r) => {
      if (this.ranks.filter((x) => x === r).length === 4) {
        result = true;
      }
    });
    return result;
  }

  private isStraightFlush(): boolean {
    return this.isStraight() && this.isFlush();
  }

  private isRoyalFlush(): boolean {
    const royalStraight = "10JQKA";
    const rankString = this.ranks.join("");
    return this.isFlush() && rankString === royalStraight;
  }
}
