/*
 * Create a list that holds all of your cards
 */
let cardList = document.getElementsByClassName("card");
let openedCards = [];

for (const card of cardList) {
  card.addEventListener("click", function(evt) {
    flipCard(evt.target);
  });
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
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

function flipCard(card) {
  //check if the card clicked is already part of a match
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
      checkForCardMatch();
    }
  }
}

function checkForCardMatch() {
  const firstCard = openedCards[0];
  const secondCard = openedCards[1];

  console.log(firstCard.firstElementChild.className);
  console.log(secondCard.firstElementChild.className);

  // check if the icon className are equal, if they are then lock them
  if (
    firstCard.firstElementChild.className ==
    secondCard.firstElementChild.className
  ) {
    for (const card of openedCards) {
      card.classList.add("match");
      card.classList.remove("open", "show");
    }
    openedCards = [];
  } else {
    console.log("No match");
    setTimeout(function() {
      for (const card of openedCards) {
        card.classList.remove("open", "show");
      }
      openedCards = [];
    }, 350);
    return false;
  }
}
