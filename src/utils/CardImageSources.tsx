let CardImageSources: any[] = [];
let CardImageKeys: string[] = [];
const suits = ["spades", "clubs", "diamonds", "hearts"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

ranks.forEach((rank) => {
  suits.forEach((suit) => {
    let card = `/images/${rank}_${suit}.png`;
    CardImageSources.push(card);
    CardImageKeys.push(`${rank}_${suit}`);
  });
});

CardImageKeys.push(`back`);
CardImageSources.push(`/images/back.png`);

export { CardImageSources, CardImageKeys };
