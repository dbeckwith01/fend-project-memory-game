/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cardList = document.getElementsByClassName("card");
const TOTAL_NUMBER_OF_CARDS = cardList.length;
const starList = document.querySelectorAll(".stars li");
const timer = document.querySelector(".timer");

let gameTimerHandle = null;
let openedCards = [];
let moveCounter = parseInt(document.querySelector(".moves").textContent);
let matchedCardList = [];

//on script run shuffle the deck
shuffleDeck();

//Add event listener for the the reset button
document.querySelector(".restart").addEventListener("click", restartGame);

function restartGame() {
  //stop timer
  if (gameTimerHandle != null) {
    clearInterval(gameTimerHandle);
    gameTimerHandle = null;
  }

  hours = 0;
  minutes = 0;
  seconds = 0;

  //reset timer text
  timer.innerText = "00:00:00";

  //loop over the card list and remove match, show and open class names
  for (const card of cardList) {
    card.classList.remove("open", "show", "match");
  }

  //reset stars
  for (const star of starList) {
    star.firstElementChild.classList.remove("fa-star-o");
    star.firstElementChild.classList.add("fa-star");
  }

  //reset moves
  moveCounter = 0;
  document.querySelector(".moves").textContent = `${moveCounter}`;

  //reset openedCard and matchedCardList
  openedCards = [];
  matchedCardList = [];

  //shuffle the deck
  shuffleDeck();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleDeck() {
  let cards = [...cardList];
  const shuffledCards = shuffle(cards);
  const deck = document.querySelector(".deck");

  const fragment = document.createDocumentFragment();

  for (const card of cards) {
    fragment.appendChild(card);
  }
  deck.appendChild(fragment);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deck.addEventListener("click", function(evt) {
  if (evt.target.nodeName === "LI") {
    flipCard(event.target);
  }
});

function flipCard(card) {
  //if the game timer isn't running then start it
  if (gameTimerHandle == null) {
    startTimer();
  }

  //check if the clicked card is already part of a match
  if (card.className.includes("match")) {
    // console.log("Already matched");
    return;
  }

  //if no cards are open then add it the clicked card to the list
  if (openedCards.length == 0) {
    openedCards.push(card);
    card.classList.add("open", "show");
  } else if (openedCards.length == 1) {
    //if one card is open then make sure the user hasn't clicked on the same card twice
    if (openedCards[0] !== card) {
      openedCards.push(card);
      card.classList.add("open", "show");
      checkForCardMatchAndAct();
    }
  }
}

function checkForCardMatchAndAct() {
  const firstCard = openedCards[0];
  const secondCard = openedCards[1];

  incrementMoves();

  // check if the icon className are equal, if they are then lock them
  if (
    firstCard.firstElementChild.className ==
    secondCard.firstElementChild.className
  ) {
    cardsMatch();

    if (TOTAL_NUMBER_OF_CARDS == matchedCardList.length) {
      clearInterval(gameTimerHandle);
      openModal();
    }
  } else {
    cardsDontMatch();
  }
}

function incrementMoves() {
  const movesElement = document.querySelector(".moves");
  moveCounter++;
  movesElement.textContent = `${moveCounter}`;

  if (moveCounter > 8 && moveCounter <= 16) {
    starList[2].firstElementChild.className = "fa fa-star-o";
  } else if (moveCounter > 16) {
    starList[1].firstElementChild.className = "fa fa-star-o";
  }
}

let hours = 0;
let minutes = 0;
let seconds = 0;
function startTimer() {
  gameTimerHandle = setInterval(function() {
    seconds++;
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }
    if (minutes == 60) {
      hour++;
      minutes = 0;
    }
    timer.innerText = `${parseInt(hours / 10)}${hours % 10}:${parseInt(
      minutes / 10
    )}${minutes % 10}:${parseInt(seconds / 10)}${seconds % 10}`;
  }, 1000);
}

function cardsMatch() {
  // console.log("Match");
  for (const card of openedCards) {
    card.classList.add("match");
    card.classList.remove("open", "show");
    matchedCardList.push(card);
  }
  openedCards = [];
}

function cardsDontMatch() {
  //no match then set a timeout to return cards restore the cards to the hidden state
  // console.log("No match");

  for (const card of openedCards) {
    card.classList.toggle("nomatch");
  }

  setTimeout(function() {
    for (const card of openedCards) {
      card.classList.remove("open", "show", "nomatch");
    }
    openedCards = [];
  }, 1050);
}

function openModal() {
  const modal = document.getElementById("winningModal");
  const remainStars = document.getElementsByClassName("fa-star");

  modal.querySelector(
    ".text"
  ).firstElementChild.innerText = `With ${moveCounter} moves, ${
    remainStars.length
  } stars and in ${timer.innerText} time`;

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("winningModal");
  modal.style.display = "none";
  restartGame();
}
