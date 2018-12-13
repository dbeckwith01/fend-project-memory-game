/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cardList = document.getElementsByClassName("card");
const TOTAL_NUMBER_OF_CARDS = cardList.length;
let openedCards = [];
let movesCnt = parseInt(document.querySelector(".moves").textContent);
let matchedCardList = [];

//Add event listener for the the reset button
document.querySelector(".restart").addEventListener("click", restartGame);

function restartGame() {
  //stop timer

  //loop over the card list and remove match, show and open class names
  for (const card of cardList) {
    card.classList.remove("open", "show", "match");
  }

  //reset stars

  //reset moves
  movesCnt = 0;
  document.querySelector(".moves").textContent = `${movesCnt}`;

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
  //check if the clicked card is already part of a match
  if (card.className.includes("match")) {
    console.log("Already matched");
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
      //stop timer

      console.log("WINNER!!");
    }
  } else {
    cardsDontMatch();
  }
}

function incrementMoves() {
  const movesElement = document.querySelector(".moves");
  movesCnt++;
  movesElement.textContent = `${movesCnt}`;
}

function cardsMatch() {
  console.log("Match");
  for (const card of openedCards) {
    card.classList.add("match");
    card.classList.remove("open", "show");
    matchedCardList.push(card);
  }
  openedCards = [];
}

function cardsDontMatch() {
  //no match then set a timeout to return cards restore the cards to the hidden state
  console.log("No match");

  for (const card of openedCards) {
    card.classList.toggle("nomatch");
  }

  setTimeout(function() {
    for (const card of openedCards) {
      card.classList.remove("open", "show", "nomatch");
    }
    openedCards = [];
  }, 1150);
}
