interface CanvasRenderingContext2D {
  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): CanvasRenderingContext2D;
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  this.fill();
  return this;
};

interface Size {
  w: number;
  h: number;
}

interface Position {
  x: number;
  y: number;
}

interface Card extends Size, Position {
  id: string;
  color: string;
}

const canvasElement = document.getElementById("game") as HTMLCanvasElement;
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
const canvas = canvasElement.getContext("2d");

let cardHeld: Card | null = null;

const cardSize: Size = {
  w: 240,
  h: 360,
};
const colors = [
  "red",
  "green",
  "yellow",
  "blue",
  "orange",
  "brown",
  "purple",
  "lime",
];

const cards: Card[] = [];

const startPos =
  window.innerWidth / 2 - (colors.length * cardSize.w) / 2.5 + cardSize.w / 4;
for (let i = 0; i < colors.length; i++) {
  cards.push({
    ...cardSize,
    id: `${i}`,
    x: startPos + ((i * cardSize.w) / 3) * 2,
    y: window.innerHeight - (cardSize.h / 3) * 2,
    color: colors[i],
  });
}

function isBetween(min: number, max: number, value: number): boolean {
  return min <= value && value <= max;
}

function mouseCollidesWithCard(card: Card, mouse: MouseEvent): boolean {
  const x = isBetween(card.x, card.x + card.w, mouse.clientX);
  const y = isBetween(card.y, card.y + card.h, mouse.clientY);
  return x && y;
}

function mouseCollidesWithAnyCard(mouse: MouseEvent): Card | undefined {
  for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i];
    console.log(i, card);
    if (mouseCollidesWithCard(card, mouse)) return card;
  }
  //return cards.find((card) => mouseCollidesWithCard(card, mouse));
}

function throttle(func: Function, delay: number) {
  let prev = Date.now() - delay;
  return (...args) => {
    let current = Date.now();
    if (current - prev >= delay) {
      prev = current;
      func.apply(null, args);
    }
  };
}

document.addEventListener(
  "mousemove",
  throttle((event) => {
    if (cardHeld) {
      cardHeld.x = event.clientX - cardHeld.w / 2;
      cardHeld.y = event.clientY - cardHeld.h / 2;
    }
  }, 16)
);

document.addEventListener("mousedown", (event) => {
  const card = mouseCollidesWithAnyCard(event);
  if (card) cardHeld = card;
});

document.addEventListener("mouseup", () => {
  cardHeld = null;
});

const render = () => {
  canvas.fillStyle = "black";
  canvas.fillRect(0, 0, window.innerWidth, window.innerHeight);
  for (const card of cards) {
    canvas.fillStyle = card.color;
    canvas.roundRect(card.x, card.y, card.w, card.h, 12);
  }
  requestAnimationFrame(render);
};

requestAnimationFrame(render);

setInterval(() => {
  console.log(cardHeld);
}, 500);
