let CardImageSources: any[] = [];
let CardImageKeys: string[] = [];
let suits = ["spades", "clubs", "diamonds", "hearts"];
let faces = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

faces.forEach((face) => {
  suits.forEach((suit) => {
    let card = `/images/${face}_${suit}.png`;
    CardImageSources.push(card);
    CardImageKeys.push(`${face}_${suit}`);
  });
});

export { CardImageSources, CardImageKeys };
