let dogUrl = "https://dog.ceo/api/breeds/image/random";
let dogSettings = {
    method: "GET"
};

window.onload = function() {

}

let uniqueImages = document.querySelector("#unique-count");
let duplicateImages = document.querySelector("#duplicate-count");
let numberOfCards = document.querySelector("#number-of-cards");
let minDuplicates = 2;
let maxDuplicates = 10;
function recalcNumCards() {
    if (duplicateImages.value < minDuplicates) {
        duplicateImages.value = minDuplicates;
    }
    else if (duplicateImages.value > maxDuplicates) {
        duplicateImages.value = maxDuplicates;
    }
    numberOfCards.innerText = uniqueImages.value * duplicateImages.value;
}

function checkEven() {
    if (duplicateImages.value % 2 !== 0) {
        duplicateImages.value ++;
        recalcNumCards();
    }
}

let gameBoard = document.getElementById("game-board");
let template = document.getElementById("card-template");
let urlList;
function startGame() {
    clearGameBoard();
    let count = 0;
    urlList = [];
    function getACard() {
        if (count == uniqueImages.value) {
            addCardsToGameBoard();
            return;
        }
        fetch(dogUrl, dogSettings)
        .then(response => response.json())
        .then(json => {
            if (urlList.indexOf(json.message) < 0) {
                for (i = 0; i < duplicateImages.value; i++) {
                    urlList.push(json.message);
                }
                count++;
            }

            getACard();
        });
    }
    function addCardsToGameBoard() {
        shuffle(urlList);
        urlList.forEach(url => {
            let newCard = template.content.cloneNode(true);
            newCard.querySelector(".front").style.backgroundImage = "url(" + url + ")";
            gameBoard.appendChild(newCard);
        });
    }

    getACard();
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function clearGameBoard() {
    let cards = document.querySelectorAll("#game-board > *");
    cards.forEach(card => gameBoard.removeChild(card));
}

function flipCard(card) {
    card.classList.toggle("flipped");
}

function flipCardUp(card) {
    card.classList.add("flipped");
}

function flipCardDown(card) {
    card.classList.remove("flipped");
}

let firstCard = null;
let secondCard = null;
function processAttempt(card) {
    if (firstCard === null) {
        firstCard = card;
        flipCardUp(firstCard);
    }
    else if (secondCard === null) {
        if (firstCard === card) {
            return;
        }
        secondCard = card;
        flipCardUp(secondCard);

        if (firstCard.querySelector(".front").style.backgroundImage === secondCard.querySelector(".front").style.backgroundImage) {
            setTimeout(function() {
                firstCard.classList.add("removed");
                secondCard.classList.add("removed");
                endOfTurnCardsDown();
            }, 1000);
        }
        else {
            setTimeout(function() {
                endOfTurnCardsDown();
            }, 1000);
        }

    }
}

function endOfTurnCardsDown() {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard = null;
    secondCard = null;
}