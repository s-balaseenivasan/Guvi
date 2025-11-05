const cardsArray = [
  "🍎", "🍌", "🍇", "🍉",
  "🍓", "🍒", "🍑", "🥝",
  "🍍"
];


let gameCards = [...cardsArray, ...cardsArray];
const gameBoard = document.getElementById("gameBoard");
const restartBtn = document.getElementById("restart");

let flippedCards = [];
let matchedPairs = 0;


function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}


function createBoard() {
  shuffle(gameCards);
  gameBoard.innerHTML = "";

  gameCards.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${emoji}</div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card, emoji));
    gameBoard.appendChild(card);
  });
}

function flipCard(card, emoji) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCards.push({ card, emoji });

    if (flippedCards.length === 2) {
      checkMatch();

    }
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.emoji === second.emoji) {
    matchedPairs++;
    setTimeout(() => {
      first.card.classList.add('hidden');
      second.card.classList.add('hidden');

    }, 1000);

    flippedCards = [];
    if (matchedPairs === cardsArray.length) {
      setTimeout(() => alert("🎉 You won!"), 500);
      setTimeout(() => restartGame() , 2000);
      
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove("flipped");
      second.card.classList.remove("flipped");
      flippedCards = [];
    }, 800);
  }
}

function restartGame() {
  matchedPairs = 0;
  flippedCards = [];
  createBoard();
}

restartBtn.addEventListener("click", restartGame);

createBoard();
