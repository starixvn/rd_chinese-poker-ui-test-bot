let CardImageSources: any[] = [];
let CardImageKeys: string[] = [];
const suits = ["spades", "clubs", "diamonds", "hearts"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

ranks.forEach((rank) => {
  suits.forEach((suit) => {
    let card = `/images/${rank}_${suit}.png`;
    CardImageSources.push(card);
    CardImageKeys.push(`${rank}_${suit}`);
  });
});

CardImageKeys.push(`back`);
CardImageSources.push(`/images/back.png`);

const preloadImage = (src: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });

const preloadImages = async () => {
  await Promise.all(CardImageSources.map((img) => preloadImage(img)));
};

export { CardImageSources, CardImageKeys, preloadImages };
